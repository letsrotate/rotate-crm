import { defineLogicFunction } from 'twenty-sdk/define';

import { SALES_COCKPIT_SYNC_CRON_LOGIC_FUNCTION_ID } from 'src/constants/universal-identifiers';
import {
  SALES_COCKPIT_SYNC_CRON_PATTERN,
  SALES_COCKPIT_SYNC_TIMEOUT_SECONDS,
} from 'src/logic-functions/constants/sales-cockpit';
import { salesCockpitSyncHandler } from 'src/logic-functions/handlers/sales-cockpit-sync-handler';

export default defineLogicFunction({
  universalIdentifier: SALES_COCKPIT_SYNC_CRON_LOGIC_FUNCTION_ID,
  name: 'sales-cockpit-sync-cron',
  description:
    'Pulls this workspace\'s Sales Cockpit initiatives every six hours and upserts them as sales initiatives linked to forwarders, stations and lanes.',
  timeoutSeconds: SALES_COCKPIT_SYNC_TIMEOUT_SECONDS,
  handler: salesCockpitSyncHandler,
  cronTriggerSettings: {
    pattern: SALES_COCKPIT_SYNC_CRON_PATTERN,
  },
});
