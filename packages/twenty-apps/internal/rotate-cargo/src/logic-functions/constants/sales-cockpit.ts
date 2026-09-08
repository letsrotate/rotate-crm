// Sales Cockpit (customer-api) contract, mirrored from letsrotate/sales-cockpit
// src/lib/utils_tracking.py and src/sqs/receive_sqs.py.

export const COGNITO_IDP_URL = 'https://cognito-idp.eu-central-1.amazonaws.com/';

export const SALES_COCKPIT_INITIATIVES_PATH = 'v1/initiatives/get/all';

export const SALES_COCKPIT_STATUSES = [
  'PENDING',
  'ACCEPTED',
  'COMPLETED',
  'DISMISSED',
  'SNOOZED',
  'CLOSED',
  'ARCHIVED_COMPLETED',
  'ARCHIVED_PENDING',
  'ARCHIVED_DISMISSED',
  'ARCHIVED_SNOOZED',
  'ARCHIVED_CLOSED',
] as const;

export const SALES_COCKPIT_FIELDS = [
  'runId',
  'runTimestamp',
  'similarityId',
  'agentName',
  'originDestination',
  'routing',
  'station',
  'category',
  'type',
  'initiativeType',
  'title',
  'regionRotateLong',
  'targetWeight',
  'targetYield',
  'airlineYield',
  'marketYield',
  'benchmarkYield',
  'revenueWeekly',
  'contributionWeekly',
  'status',
  'statusChangedAt',
  'assignee',
] as const;

// Twenty batches mutations at 60 records.
export const MUTATION_BATCH_SIZE = 60;
export const QUERY_PAGE_SIZE = 200;

// Every six hours: the cockpit publishes monthly runs, users act daily.
export const SALES_COCKPIT_SYNC_CRON_PATTERN = '0 */6 * * *';
export const SALES_COCKPIT_SYNC_TIMEOUT_SECONDS = 240;
