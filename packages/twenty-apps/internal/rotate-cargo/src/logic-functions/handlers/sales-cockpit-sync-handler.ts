import { CoreApiClient } from 'twenty-client-sdk/core';

import {
  MUTATION_BATCH_SIZE,
  QUERY_PAGE_SIZE,
} from 'src/logic-functions/constants/sales-cockpit';
import {
  mapSalesCockpitInitiative,
  pickUpdatableFields,
  type SalesInitiativeRecordFields,
  splitOriginDestination,
} from 'src/logic-functions/utils/map-initiative';
import {
  fetchCognitoIdToken,
  fetchSalesCockpitInitiatives,
  readSalesCockpitConfig,
} from 'src/logic-functions/utils/sales-cockpit-client';

export type SalesCockpitSyncResult = {
  success: boolean;
  tenant: string | null;
  fetched: number;
  created: number;
  updated: number;
  stationsCreated: number;
  lanesCreated: number;
  unmatchedForwarders: string[];
  syncedAt: string;
  error?: string;
};

type ExistingInitiative = { id: string; externalId: string };
type CompanyRecord = {
  id: string;
  name: string;
  salesCockpitAgentName: string | null;
};
type StationRecord = { id: string; iataCode: string };
type LaneRecord = { id: string; name: string };

// The generated client types only know the standard objects; this app's own
// objects are queried through the untyped escape hatch.
type UntypedClient = {
  query: (input: any) => Promise<any>;
  mutation: (input: any) => Promise<any>;
};

const chunk = <TItem>(items: TItem[], size: number): TItem[][] => {
  const chunks: TItem[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const normalizeKey = (value: string | null | undefined): string =>
  (value ?? '').trim().toLowerCase();

const listAll = async <TNode>(
  client: UntypedClient,
  objectNamePlural: string,
  nodeSelection: Record<string, true>,
  filter?: Record<string, unknown>,
): Promise<TNode[]> => {
  const nodes: TNode[] = [];
  let after: string | undefined;

  for (;;) {
    const result = await client.query({
      [objectNamePlural]: {
        __args: {
          first: QUERY_PAGE_SIZE,
          ...(after ? { after } : {}),
          ...(filter ? { filter } : {}),
        },
        edges: { node: nodeSelection },
        pageInfo: { hasNextPage: true, endCursor: true },
      },
    });
    const connection = result[objectNamePlural];

    nodes.push(...connection.edges.map((edge: { node: TNode }) => edge.node));

    if (!connection.pageInfo?.hasNextPage || !connection.pageInfo?.endCursor) {
      return nodes;
    }

    after = connection.pageInfo.endCursor;
  }
};

const ensureStations = async (
  client: UntypedClient,
  iataCodes: string[],
): Promise<{ byIata: Map<string, string>; created: number }> => {
  const existing = await listAll<StationRecord>(client, 'stations', {
    id: true,
    iataCode: true,
  });
  const byIata = new Map(
    existing.map((station) => [station.iataCode.toUpperCase(), station.id]),
  );
  const missing = [...new Set(iataCodes)].filter((code) => !byIata.has(code));

  for (const batch of chunk(missing, MUTATION_BATCH_SIZE)) {
    const result = await client.mutation({
      createStations: {
        __args: { data: batch.map((iataCode) => ({ iataCode })) },
        id: true,
        iataCode: true,
      },
    });

    for (const station of result.createStations as StationRecord[]) {
      byIata.set(station.iataCode.toUpperCase(), station.id);
    }
  }

  return { byIata, created: missing.length };
};

const ensureLanes = async (
  client: UntypedClient,
  laneNames: string[],
  stationIdByIata: Map<string, string>,
): Promise<{ byName: Map<string, string>; created: number }> => {
  const existing = await listAll<LaneRecord>(client, 'lanes', {
    id: true,
    name: true,
  });
  const byName = new Map(existing.map((lane) => [lane.name.toUpperCase(), lane.id]));
  const missing = [...new Set(laneNames)].filter((name) => !byName.has(name));

  for (const batch of chunk(missing, MUTATION_BATCH_SIZE)) {
    const result = await client.mutation({
      createLanes: {
        __args: {
          data: batch.map((name) => {
            const split = splitOriginDestination(name);

            return {
              name,
              originIata: split?.originIata ?? null,
              destinationIata: split?.destinationIata ?? null,
              originId: split ? (stationIdByIata.get(split.originIata) ?? null) : null,
              destinationId: split
                ? (stationIdByIata.get(split.destinationIata) ?? null)
                : null,
            };
          }),
        },
        id: true,
        name: true,
      },
    });

    for (const lane of result.createLanes as LaneRecord[]) {
      byName.set(lane.name.toUpperCase(), lane.id);
    }
  }

  return { byName, created: missing.length };
};

// Forwarders are matched on the explicit Sales Cockpit agent name first, then
// on the company name, both case-insensitive. Unmatched names are reported
// so an admin can set salesCockpitAgentName on the right company.
const indexForwarders = (companies: CompanyRecord[]) => {
  const byAgentName = new Map<string, string>();
  const byCompanyName = new Map<string, string>();

  for (const company of companies) {
    const agentKey = normalizeKey(company.salesCockpitAgentName);

    if (agentKey.length > 0 && !byAgentName.has(agentKey)) {
      byAgentName.set(agentKey, company.id);
    }

    const nameKey = normalizeKey(company.name);

    if (nameKey.length > 0 && !byCompanyName.has(nameKey)) {
      byCompanyName.set(nameKey, company.id);
    }
  }

  return (agentName: string | null): string | null => {
    const key = normalizeKey(agentName);

    if (key.length === 0) {
      return null;
    }

    return byAgentName.get(key) ?? byCompanyName.get(key) ?? null;
  };
};

export const salesCockpitSyncHandler =
  async (): Promise<SalesCockpitSyncResult> => {
    const syncedAt = new Date().toISOString();
    const config = readSalesCockpitConfig();

    if (config === null) {
      return {
        success: false,
        tenant: null,
        fetched: 0,
        created: 0,
        updated: 0,
        stationsCreated: 0,
        lanesCreated: 0,
        unmatchedForwarders: [],
        syncedAt,
        error:
          'SALES_COCKPIT_TENANT is not set for this workspace (Settings → Applications → Rotate Cargo).',
      };
    }

    const client = new CoreApiClient() as unknown as UntypedClient;

    try {
      const idToken = await fetchCognitoIdToken(config);
      const initiatives = await fetchSalesCockpitInitiatives(config, idToken);
      const appUrl = process.env.SALES_COCKPIT_APP_URL;

      const mapped = initiatives
        .filter((initiative) => typeof initiative._id === 'string')
        .map((initiative) =>
          mapSalesCockpitInitiative({
            initiative,
            tenant: config.tenant,
            appUrl,
            syncedAt,
          }),
        );

      const [existing, companies] = await Promise.all([
        listAll<ExistingInitiative>(client, 'salesInitiatives', {
          id: true,
          externalId: true,
        }),
        listAll<CompanyRecord>(client, 'companies', {
          id: true,
          name: true,
          salesCockpitAgentName: true,
        }),
      ]);

      const stationCodes = mapped
        .flatMap((fields) => {
          const split = splitOriginDestination(fields.originDestination);

          return [
            fields.stationIata,
            split?.originIata ?? null,
            split?.destinationIata ?? null,
          ];
        })
        .filter((code): code is string => code !== null && /^[A-Z]{3}$/.test(code));
      const stations = await ensureStations(client, stationCodes);

      const laneNames = mapped
        .map((fields) => fields.originDestination)
        .filter((name): name is string => name !== null && splitOriginDestination(name) !== null);
      const lanes = await ensureLanes(client, laneNames, stations.byIata);

      const resolveForwarderId = indexForwarders(companies);
      const unmatched = new Set<string>();

      const withRelations = mapped.map((fields) => {
        const forwarderId = resolveForwarderId(fields.agentName);

        if (forwarderId === null && fields.agentName !== null) {
          unmatched.add(fields.agentName);
        }

        return {
          fields,
          relations: {
            forwarderId,
            stationId: fields.stationIata
              ? (stations.byIata.get(fields.stationIata) ?? null)
              : null,
            laneId: fields.originDestination
              ? (lanes.byName.get(fields.originDestination) ?? null)
              : null,
          },
        };
      });

      const existingIdByExternalId = new Map(
        existing.map((record) => [record.externalId, record.id]),
      );

      const toCreate = withRelations.filter(
        ({ fields }) => !existingIdByExternalId.has(fields.externalId),
      );
      const toUpdate = withRelations.filter(({ fields }) =>
        existingIdByExternalId.has(fields.externalId),
      );

      for (const batch of chunk(toCreate, MUTATION_BATCH_SIZE)) {
        await client.mutation({
          createSalesInitiatives: {
            __args: {
              data: batch.map(({ fields, relations }) => ({
                ...fields,
                ...relations,
              })),
            },
            id: true,
          },
        });
      }

      for (const { fields, relations } of toUpdate) {
        const id = existingIdByExternalId.get(fields.externalId) as string;
        const data: Omit<SalesInitiativeRecordFields, 'externalId'> &
          typeof relations = { ...pickUpdatableFields(fields), ...relations };

        await client.mutation({
          updateSalesInitiative: {
            __args: { id, data },
            id: true,
          },
        });
      }

      const result: SalesCockpitSyncResult = {
        success: true,
        tenant: config.tenant,
        fetched: initiatives.length,
        created: toCreate.length,
        updated: toUpdate.length,
        stationsCreated: stations.created,
        lanesCreated: lanes.created,
        unmatchedForwarders: [...unmatched].sort(),
        syncedAt,
      };

      console.log('[rotate-cargo] Sales Cockpit sync finished', result);

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      console.error('[rotate-cargo] Sales Cockpit sync failed', message);

      return {
        success: false,
        tenant: config.tenant,
        fetched: 0,
        created: 0,
        updated: 0,
        stationsCreated: 0,
        lanesCreated: 0,
        unmatchedForwarders: [],
        syncedAt,
        error: message,
      };
    }
  };
