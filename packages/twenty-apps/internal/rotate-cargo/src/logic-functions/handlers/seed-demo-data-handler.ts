import { CoreApiClient } from 'twenty-client-sdk/core';

import { MUTATION_BATCH_SIZE, QUERY_PAGE_SIZE } from 'src/logic-functions/constants/sales-cockpit';
import { DEMO_TENANTS } from 'src/logic-functions/constants/demo-data';
import { type DemoTenant } from 'src/logic-functions/constants/demo-data/demo-tenant.type';
import { splitOriginDestination } from 'src/logic-functions/utils/map-initiative';

export type SeedDemoDataResult = {
  success: boolean;
  tenant: string | null;
  counts: Record<string, number>;
  unmatchedStaff: string[];
  error?: string;
};

type UntypedClient = {
  query: (input: any) => Promise<any>;
  mutation: (input: any) => Promise<any>;
};

type Row = Record<string, any>;

const chunk = <TItem>(items: TItem[], size: number): TItem[][] => {
  const chunks: TItem[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const usd = (amount: number) => ({
  amountMicros: Math.round(amount * 1_000_000),
  currencyCode: 'USD',
});

const listAll = async (
  client: UntypedClient,
  objectNamePlural: string,
  nodeSelection: Record<string, unknown>,
): Promise<Row[]> => {
  const nodes: Row[] = [];
  let after: string | undefined;

  for (;;) {
    const result = await client.query({
      [objectNamePlural]: {
        __args: { first: QUERY_PAGE_SIZE, ...(after ? { after } : {}) },
        edges: { node: nodeSelection },
        pageInfo: { hasNextPage: true, endCursor: true },
      },
    });
    const connection = result[objectNamePlural];

    nodes.push(...connection.edges.map((edge: { node: Row }) => edge.node));

    if (!connection.pageInfo?.hasNextPage || !connection.pageInfo?.endCursor) {
      return nodes;
    }

    after = connection.pageInfo.endCursor;
  }
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

// Upsert by a natural key: creates the missing rows in batches, updates the
// rest one by one, returns key -> id. Records are plain REST/GraphQL shapes.
const upsertByKey = async ({
  client,
  objectNameSingular,
  objectNamePlural,
  keyField,
  keySelection,
  rows,
}: {
  client: UntypedClient;
  objectNameSingular: string;
  objectNamePlural: string;
  keyField: string;
  // Composite keys (emails) need their sub-fields selected explicitly.
  keySelection?: Record<string, unknown>;
  rows: Row[];
}): Promise<{ idByKey: Map<string, string>; created: number; updated: number }> => {
  const selection = { id: true, [keyField]: keySelection ?? true };
  const existing = await listAll(client, objectNamePlural, selection);
  const idByKey = new Map<string, string>(
    existing
      .filter((record) => typeof keyValue(record[keyField]) === 'string')
      .map((record) => [keyValue(record[keyField]) as string, record.id as string]),
  );

  const toCreate = rows.filter((row) => !idByKey.has(keyValue(row[keyField]) as string));
  const toUpdate = rows.filter((row) => idByKey.has(keyValue(row[keyField]) as string));
  const createMutation = `create${capitalize(objectNamePlural)}`;
  const updateMutation = `update${capitalize(objectNameSingular)}`;

  for (const batch of chunk(toCreate, MUTATION_BATCH_SIZE)) {
    const result = await client.mutation({
      [createMutation]: {
        __args: { data: batch },
        ...selection,
      },
    });

    for (const record of result[createMutation] as Row[]) {
      idByKey.set(keyValue(record[keyField]) as string, record.id);
    }
  }

  for (const row of toUpdate) {
    const id = idByKey.get(keyValue(row[keyField]) as string) as string;

    await client.mutation({
      [updateMutation]: { __args: { id, data: row }, id: true },
    });
  }

  return { idByKey, created: toCreate.length, updated: toUpdate.length };
};

// Composite keys (emails.primaryEmail) come back as objects; reduce to the
// string the dataset uses.
const keyValue = (value: unknown): unknown => {
  if (value !== null && typeof value === 'object' && 'primaryEmail' in (value as Row)) {
    return ((value as Row).primaryEmail as string | null)?.toLowerCase() ?? null;
  }

  return typeof value === 'string' ? value : value;
};

export const seedDemoDataHandler = async (
  input: { tenant?: string },
): Promise<SeedDemoDataResult> => {
  const tenantKey = (input.tenant ?? process.env.SALES_COCKPIT_TENANT ?? '').trim().toLowerCase();
  const tenant: DemoTenant | undefined = DEMO_TENANTS[tenantKey];

  if (!tenant) {
    return {
      success: false,
      tenant: tenantKey || null,
      counts: {},
      unmatchedStaff: [],
      error: `Unknown demo tenant "${tenantKey}". Known: ${Object.keys(DEMO_TENANTS).join(', ')}.`,
    };
  }

  const client = new CoreApiClient() as unknown as UntypedClient;
  const counts: Record<string, number> = {};
  const unmatchedStaff = new Set<string>();

  try {
    // 1. Staff: members already exist (invited users / dev seeder); link by email.
    const members = await listAll(client, 'workspaceMembers', { id: true, userEmail: true });
    const memberIdByEmail = new Map(
      members.map((member) => [String(member.userEmail).toLowerCase(), member.id as string]),
    );
    const memberId = (email: string | null | undefined): string | null => {
      if (!email) {
        return null;
      }
      const id = memberIdByEmail.get(email.toLowerCase());

      if (!id) {
        unmatchedStaff.add(email);
      }

      return id ?? null;
    };

    // 2. Regions with their regional managers.
    const regions = await upsertByKey({
      client,
      objectNameSingular: 'region',
      objectNamePlural: 'regions',
      keyField: 'code',
      rows: tenant.regions.map((region) => ({
        code: region.code,
        name: region.name,
        description: region.description,
        regionalManagerId: memberId(region.regionalManagerEmail),
      })),
    });
    counts.regions = regions.created + regions.updated;

    // 3. Stations inside their regions.
    const stations = await upsertByKey({
      client,
      objectNameSingular: 'station',
      objectNamePlural: 'stations',
      keyField: 'iataCode',
      rows: tenant.regions.flatMap((region) =>
        region.stations.map((station) => ({
          iataCode: station.iata,
          name: station.name,
          country: station.country,
          region: station.region,
          isHub: station.isHub ?? false,
          salesRegionId: regions.idByKey.get(region.code) ?? null,
        })),
      ),
    });
    counts.stations = stations.created + stations.updated;

    // 4. Staff roles and station assignment.
    const roleByEmail = new Map<string, { cargoRole: string; stationId: string | null }>();

    roleByEmail.set(tenant.headOfSalesEmail.toLowerCase(), { cargoRole: 'HEAD_OF_SALES', stationId: null });
    for (const region of tenant.regions) {
      roleByEmail.set(region.regionalManagerEmail.toLowerCase(), { cargoRole: 'REGIONAL_MANAGER', stationId: null });
    }
    for (const [email, iata] of Object.entries(tenant.accountManagerStations)) {
      roleByEmail.set(email.toLowerCase(), {
        cargoRole: 'ACCOUNT_MANAGER',
        stationId: stations.idByKey.get(iata) ?? null,
      });
    }

    let staffUpdated = 0;

    for (const [email, data] of roleByEmail) {
      const id = memberId(email);

      if (!id) {
        continue;
      }
      await client.mutation({ updateWorkspaceMember: { __args: { id, data }, id: true } });
      staffUpdated += 1;
    }
    counts.staff = staffUpdated;

    // 5. Forwarders (companies) owned by their station account manager.
    const forwarders = await upsertByKey({
      client,
      objectNameSingular: 'company',
      objectNamePlural: 'companies',
      keyField: 'name',
      rows: tenant.forwarders.map((forwarder) => ({
        name: forwarder.name,
        domainName: { primaryLinkUrl: `https://${forwarder.domain}`, primaryLinkLabel: '', secondaryLinks: [] },
        iataCassCode: forwarder.cassCode,
        forwarderSegment: forwarder.segment,
        forwarderTier: forwarder.tier,
        salesCockpitAgentName: forwarder.agentName,
        homeStationId: stations.idByKey.get(forwarder.homeStation) ?? null,
        accountOwnerId: memberId(forwarder.accountOwnerEmail),
        address: { addressCity: forwarder.city },
      })),
    });
    counts.forwarders = forwarders.created + forwarders.updated;

    // 6. Contacts at the forwarders.
    const contacts = await upsertByKey({
      client,
      objectNameSingular: 'person',
      objectNamePlural: 'people',
      keyField: 'emails',
      keySelection: { primaryEmail: true },
      rows: tenant.forwarders.flatMap((forwarder) =>
        forwarder.contacts.map((contact) => ({
          name: { firstName: contact.firstName, lastName: contact.lastName },
          emails: { primaryEmail: contact.email, additionalEmails: [] },
          jobTitle: contact.jobTitle,
          ...(contact.phone
            ? {
                phones: {
                  primaryPhoneNumber: contact.phone.number,
                  primaryPhoneCallingCode: contact.phone.callingCode,
                  primaryPhoneCountryCode: contact.phone.countryCode,
                  additionalPhones: [],
                },
              }
            : {}),
          companyId: forwarders.idByKey.get(forwarder.name) ?? null,
        })),
      ),
    });
    counts.contacts = contacts.created + contacts.updated;

    // 7. Lanes between the stations.
    const lanes = await upsertByKey({
      client,
      objectNameSingular: 'lane',
      objectNamePlural: 'lanes',
      keyField: 'name',
      rows: tenant.lanes.map((lane) => {
        const split = splitOriginDestination(lane.name);

        return {
          name: lane.name,
          originIata: split?.originIata ?? null,
          destinationIata: split?.destinationIata ?? null,
          originId: split ? (stations.idByKey.get(split.originIata) ?? null) : null,
          destinationId: split ? (stations.idByKey.get(split.destinationIata) ?? null) : null,
          legColour: lane.legColour,
          weeklyTonnesAirline: lane.weeklyTonnesAirline,
          weeklyTonnesMarket: lane.weeklyTonnesMarket,
          yieldAirline: lane.yieldAirline,
          yieldMarket: lane.yieldMarket,
        };
      }),
    });
    counts.lanes = lanes.created + lanes.updated;

    // 8. Sales Cockpit initiatives, shaped like the sync output.
    const forwarderIdByAgentName = new Map(
      tenant.forwarders.map((forwarder) => [
        forwarder.agentName.toLowerCase(),
        forwarders.idByKey.get(forwarder.name) ?? null,
      ]),
    );
    const runTimestamp = '2026-09-01T06:00:00.000Z';
    const syncedAt = new Date().toISOString();
    const appUrl = (process.env.SALES_COCKPIT_APP_URL ?? 'https://app.prod.letsrotate.com').replace(/\/+$/, '');

    const initiatives = await upsertByKey({
      client,
      objectNameSingular: 'salesInitiative',
      objectNamePlural: 'salesInitiatives',
      keyField: 'externalId',
      rows: tenant.initiatives.map(
        ([externalId, initiativeNumber, category, initiativeType, status, agentName, stationIata, originDestination, routing, targetWeightTonnes, targetYield, airlineYield, marketYield, revenueWeekly, assigneeEmail, name], index) => ({
          name,
          externalId,
          runId: `run-2026-09-${tenant.key}`,
          similarityId: `${initiativeNumber}${stationIata}${originDestination}${agentName}${routing}`.replace(/\s+/g, ''),
          initiativeNumber,
          category,
          initiativeType,
          status,
          agentName,
          stationIata,
          originDestination,
          routing,
          region: tenant.regions.find((region) => region.stations.some((station) => station.iata === stationIata))?.name ?? null,
          targetWeightTonnes,
          targetYield,
          airlineYield,
          marketYield,
          benchmarkYield: marketYield === null ? null : Math.round((marketYield - 0.08) * 100) / 100,
          revenueWeekly: usd(revenueWeekly),
          contributionWeekly: usd(Math.round(revenueWeekly * 0.35)),
          assigneeName: null,
          assigneeEmail,
          assigneeId: memberId(assigneeEmail),
          runTimestamp,
          statusChangedAt: new Date(Date.parse(runTimestamp) + (index + 1) * 36 * 3_600_000).toISOString(),
          lastSyncedAt: syncedAt,
          cockpitUrl: {
            primaryLinkUrl: `${appUrl}/cockpit/${tenant.key}/browser?initiativeId=${externalId}`,
            primaryLinkLabel: 'Sales Cockpit',
            secondaryLinks: [],
          },
          forwarderId: forwarderIdByAgentName.get(agentName.toLowerCase()) ?? null,
          stationId: stations.idByKey.get(stationIata) ?? null,
          laneId: lanes.idByKey.get(originDestination) ?? null,
        }),
      ),
    });
    counts.initiatives = initiatives.created + initiatives.updated;

    // 9. Opportunities, notes and tasks: created once (keyed on title).
    const contactIdByEmail = contacts.idByKey;
    const opportunities = await upsertByKey({
      client,
      objectNameSingular: 'opportunity',
      objectNamePlural: 'opportunities',
      keyField: 'name',
      rows: tenant.opportunities.map((opportunity) => ({
        name: opportunity.name,
        stage: opportunity.stage,
        amount: usd(opportunity.amountUsd),
        closeDate: `${opportunity.closeDate}T00:00:00.000Z`,
        companyId: forwarders.idByKey.get(opportunity.forwarder) ?? null,
        pointOfContactId: contactIdByEmail.get(opportunity.contactEmail.toLowerCase()) ?? null,
      })),
    });
    counts.opportunities = opportunities.created + opportunities.updated;

    const existingNotes = await listAll(client, 'notes', { id: true, title: true });
    const existingNoteTitles = new Set(existingNotes.map((note) => note.title));
    let notesCreated = 0;

    for (const note of tenant.notes) {
      if (existingNoteTitles.has(note.title)) {
        continue;
      }
      const created = await client.mutation({
        createNote: {
          __args: { data: { title: note.title, bodyV2: { markdown: note.markdown } } },
          id: true,
        },
      });

      await client.mutation({
        createNoteTarget: {
          __args: { data: { noteId: created.createNote.id, targetCompanyId: forwarders.idByKey.get(note.forwarder) ?? null } },
          id: true,
        },
      });
      notesCreated += 1;
    }
    counts.notes = notesCreated;

    const existingTasks = await listAll(client, 'tasks', { id: true, title: true });
    const existingTaskTitles = new Set(existingTasks.map((task) => task.title));
    let tasksCreated = 0;

    for (const task of tenant.tasks) {
      if (existingTaskTitles.has(task.title)) {
        continue;
      }
      const created = await client.mutation({
        createTask: {
          __args: {
            data: {
              title: task.title,
              bodyV2: { markdown: task.markdown },
              status: task.status,
              dueAt: task.dueAt,
              assigneeId: memberId(task.assigneeEmail),
            },
          },
          id: true,
        },
      });

      await client.mutation({
        createTaskTarget: {
          __args: { data: { taskId: created.createTask.id, targetCompanyId: forwarders.idByKey.get(task.forwarder) ?? null } },
          id: true,
        },
      });
      tasksCreated += 1;
    }
    counts.tasks = tasksCreated;

    const result: SeedDemoDataResult = {
      success: true,
      tenant: tenant.key,
      counts,
      unmatchedStaff: [...unmatchedStaff].sort(),
    };

    console.log('[rotate-cargo] Demo data seeded', result);

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.error('[rotate-cargo] Demo seed failed', message);

    return { success: false, tenant: tenant.key, counts, unmatchedStaff: [...unmatchedStaff], error: message };
  }
};
