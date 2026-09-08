import { defineLogicFunction } from 'twenty-sdk/define';

import { SALES_COCKPIT_SYNC_ROUTE_LOGIC_FUNCTION_ID } from 'src/constants/universal-identifiers';
import { SALES_COCKPIT_SYNC_TIMEOUT_SECONDS } from 'src/logic-functions/constants/sales-cockpit';
import { salesCockpitSyncHandler } from 'src/logic-functions/handlers/sales-cockpit-sync-handler';

const SYNC_RESULT_SCHEMA = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    tenant: { type: 'string' },
    fetched: { type: 'number' },
    created: { type: 'number' },
    updated: { type: 'number' },
    stationsCreated: { type: 'number' },
    lanesCreated: { type: 'number' },
    unmatchedForwarders: { type: 'array', items: { type: 'string' } },
    syncedAt: { type: 'string' },
    error: { type: 'string' },
  },
} as const;

// On-demand sync: the dashboard panel's "Sync now" button, workflows, and
// AI agents all call the same handler as the cron.
export default defineLogicFunction({
  universalIdentifier: SALES_COCKPIT_SYNC_ROUTE_LOGIC_FUNCTION_ID,
  name: 'sales-cockpit-sync',
  description:
    'Sync Sales Cockpit initiatives into this workspace now. Returns counts of created and updated initiatives and the forwarder names that could not be matched to a company.',
  timeoutSeconds: SALES_COCKPIT_SYNC_TIMEOUT_SECONDS,
  handler: salesCockpitSyncHandler,
  httpRouteTriggerSettings: {
    path: '/sales-cockpit/sync',
    httpMethod: 'POST',
    isAuthRequired: true,
  },
  toolTriggerSettings: {
    inputSchema: { type: 'object', properties: {} },
  },
  workflowActionTriggerSettings: {
    label: 'Sync Sales Cockpit initiatives',
    inputSchema: [{ type: 'object', properties: {} }],
    outputSchema: [SYNC_RESULT_SCHEMA],
  },
});
