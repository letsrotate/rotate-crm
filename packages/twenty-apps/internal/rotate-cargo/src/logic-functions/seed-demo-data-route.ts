import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';

import { SEED_DEMO_DATA_LOGIC_FUNCTION_ID } from 'src/constants/universal-identifiers';
import { seedDemoDataHandler } from 'src/logic-functions/handlers/seed-demo-data-handler';

const handler = async (event: RoutePayload) => {
  const body = event.body as Record<string, unknown> | null;

  return seedDemoDataHandler({
    tenant:
      (body?.tenant as string | undefined) ??
      event.queryStringParameters?.tenant,
  });
};

// Loads a realistic airline dataset (regions, stations, staff roles,
// forwarders, contacts, lanes, initiatives, opportunities, notes, tasks) into
// the current workspace. Idempotent: re-runs update in place. Used by the
// local dev setup and for demo tenants; never wired to a cron.
export default defineLogicFunction({
  universalIdentifier: SEED_DEMO_DATA_LOGIC_FUNCTION_ID,
  name: 'seed-demo-data',
  description:
    'Seed the workspace with the demo airline dataset for the given tenant (etihad | rotate).',
  timeoutSeconds: 240,
  handler,
  httpRouteTriggerSettings: {
    path: '/rotate-cargo/seed-demo',
    httpMethod: 'POST',
    isAuthRequired: true,
  },
});
