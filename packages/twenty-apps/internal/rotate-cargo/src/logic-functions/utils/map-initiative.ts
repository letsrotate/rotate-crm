import { type SalesCockpitInitiative } from 'src/logic-functions/utils/sales-cockpit-client';

export type SalesInitiativeRecordFields = {
  name: string;
  externalId: string;
  runId: string | null;
  similarityId: string | null;
  initiativeNumber: string | null;
  category: string | null;
  initiativeType: 'RATE' | 'MIX' | 'VOLUME' | null;
  status:
    | 'PENDING'
    | 'ACCEPTED'
    | 'COMPLETED'
    | 'SNOOZED'
    | 'DISMISSED'
    | 'CLOSED'
    | 'ARCHIVED';
  agentName: string | null;
  stationIata: string | null;
  originDestination: string | null;
  routing: string | null;
  region: string | null;
  targetWeightTonnes: number | null;
  targetYield: number | null;
  airlineYield: number | null;
  marketYield: number | null;
  benchmarkYield: number | null;
  revenueWeekly: { amountMicros: number; currencyCode: 'USD' } | null;
  contributionWeekly: { amountMicros: number; currencyCode: 'USD' } | null;
  assigneeName: string | null;
  assigneeEmail: string | null;
  runTimestamp: string | null;
  statusChangedAt: string | null;
  lastSyncedAt: string;
  cockpitUrl: {
    primaryLinkUrl: string;
    primaryLinkLabel: string;
    secondaryLinks: never[];
  } | null;
};

const INITIATIVE_TYPE_BY_COCKPIT_VALUE: Record<
  string,
  SalesInitiativeRecordFields['initiativeType']
> = {
  rate: 'RATE',
  mix: 'MIX',
  volume: 'VOLUME',
};

const usd = (
  amount: number | null | undefined,
): SalesInitiativeRecordFields['revenueWeekly'] =>
  typeof amount === 'number' && Number.isFinite(amount)
    ? { amountMicros: Math.round(amount * 1_000_000), currencyCode: 'USD' }
    : null;

const numberOrNull = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const textOrNull = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

// ARCHIVED_<STATE> collapses onto ARCHIVED; anything unknown is PENDING so a
// new cockpit status never breaks the sync.
export const mapSalesCockpitStatus = (
  status: string | null | undefined,
): SalesInitiativeRecordFields['status'] => {
  const normalized = (status ?? '').toUpperCase();

  if (normalized.startsWith('ARCHIVED')) {
    return 'ARCHIVED';
  }

  switch (normalized) {
    case 'ACCEPTED':
    case 'COMPLETED':
    case 'SNOOZED':
    case 'DISMISSED':
    case 'CLOSED':
      return normalized;
    default:
      return 'PENDING';
  }
};

// The cockpit's `type` is the init_type (rate/mix/volume); `initiativeType`
// carries the rule number ("3.1") on newer runs.
export const mapSalesCockpitInitiativeType = (
  initiative: Pick<SalesCockpitInitiative, 'type' | 'initiativeType'>,
): SalesInitiativeRecordFields['initiativeType'] => {
  const candidates = [initiative.type, initiative.initiativeType];

  for (const candidate of candidates) {
    const mapped =
      INITIATIVE_TYPE_BY_COCKPIT_VALUE[(candidate ?? '').toLowerCase()];

    if (mapped) {
      return mapped;
    }
  }

  return null;
};

export const extractInitiativeNumber = (
  initiative: Pick<SalesCockpitInitiative, 'initiativeType' | 'similarityId'>,
): string | null => {
  if (/^\d+\.\d+$/.test(initiative.initiativeType ?? '')) {
    return initiative.initiativeType as string;
  }

  // similarity_id = init_number + station + O&D + ... with spaces stripped.
  const match = /^(\d+\.\d+)/.exec(initiative.similarityId ?? '');

  return match ? match[1] : null;
};

export const buildCockpitUrl = (
  appUrl: string | undefined,
  tenant: string,
  initiativeId: string,
): SalesInitiativeRecordFields['cockpitUrl'] => {
  const base = (appUrl ?? '').trim().replace(/\/+$/, '');

  if (base.length === 0) {
    return null;
  }

  return {
    primaryLinkUrl: `${base}/cockpit/${tenant}/browser?initiativeId=${encodeURIComponent(initiativeId)}`,
    primaryLinkLabel: 'Sales Cockpit',
    secondaryLinks: [],
  };
};

export const buildInitiativeTitle = (
  initiative: SalesCockpitInitiative,
): string => {
  const title = textOrNull(initiative.title);

  if (title) {
    return title;
  }

  return [initiative.category, initiative.agentName, initiative.originDestination]
    .map(textOrNull)
    .filter((part): part is string => part !== null)
    .join(' · ') || initiative._id;
};

export const mapSalesCockpitInitiative = ({
  initiative,
  tenant,
  appUrl,
  syncedAt,
}: {
  initiative: SalesCockpitInitiative;
  tenant: string;
  appUrl: string | undefined;
  syncedAt: string;
}): SalesInitiativeRecordFields => ({
  name: buildInitiativeTitle(initiative),
  externalId: initiative._id,
  runId: textOrNull(initiative.runId),
  similarityId: textOrNull(initiative.similarityId),
  initiativeNumber: extractInitiativeNumber(initiative),
  category: textOrNull(initiative.category),
  initiativeType: mapSalesCockpitInitiativeType(initiative),
  status: mapSalesCockpitStatus(initiative.status),
  agentName: textOrNull(initiative.agentName),
  stationIata: textOrNull(initiative.station)?.toUpperCase() ?? null,
  originDestination:
    textOrNull(initiative.originDestination)?.toUpperCase() ?? null,
  routing: textOrNull(initiative.routing)?.toUpperCase() ?? null,
  region: textOrNull(initiative.regionRotateLong),
  targetWeightTonnes: numberOrNull(initiative.targetWeight),
  targetYield: numberOrNull(initiative.targetYield),
  airlineYield: numberOrNull(initiative.airlineYield),
  marketYield: numberOrNull(initiative.marketYield),
  benchmarkYield: numberOrNull(initiative.benchmarkYield),
  revenueWeekly: usd(initiative.revenueWeekly),
  contributionWeekly: usd(initiative.contributionWeekly),
  assigneeName: textOrNull(initiative.assignee?.name),
  assigneeEmail: textOrNull(initiative.assignee?.email)?.toLowerCase() ?? null,
  runTimestamp: textOrNull(initiative.runTimestamp),
  statusChangedAt: textOrNull(initiative.statusChangedAt),
  lastSyncedAt: syncedAt,
  cockpitUrl: buildCockpitUrl(appUrl, tenant, initiative._id),
});

// Fields that change between runs; identity fields are only set on create.
export const pickUpdatableFields = (
  fields: SalesInitiativeRecordFields,
): Omit<SalesInitiativeRecordFields, 'externalId'> => {
  const updatable: Partial<SalesInitiativeRecordFields> = { ...fields };

  delete updatable.externalId;

  return updatable as Omit<SalesInitiativeRecordFields, 'externalId'>;
};

export const splitOriginDestination = (
  originDestination: string | null,
): { originIata: string; destinationIata: string } | null => {
  const match = /^([A-Z]{3})-([A-Z]{3})$/.exec(originDestination ?? '');

  return match ? { originIata: match[1], destinationIata: match[2] } : null;
};
