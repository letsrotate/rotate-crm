import { type DemoTenant } from 'src/logic-functions/constants/demo-data/demo-tenant.type';
import { ETIHAD_DEMO_TENANT } from 'src/logic-functions/constants/demo-data/etihad.demo-tenant';
import { ROTATE_AIRLINES_DEMO_TENANT } from 'src/logic-functions/constants/demo-data/rotate-airlines.demo-tenant';

export const DEMO_TENANTS: Record<string, DemoTenant> = {
  [ETIHAD_DEMO_TENANT.key]: ETIHAD_DEMO_TENANT,
  [ROTATE_AIRLINES_DEMO_TENANT.key]: ROTATE_AIRLINES_DEMO_TENANT,
};
