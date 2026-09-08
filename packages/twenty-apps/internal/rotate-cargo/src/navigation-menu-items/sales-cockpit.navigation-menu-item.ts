import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { SALES_COCKPIT_DASHBOARD_PAGE_LAYOUT_ID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: '8fcefe33-affb-4abd-9b00-5f146148ca59',
  name: 'Sales Cockpit',
  icon: 'IconChartBar',
  position: 0,
  type: NavigationMenuItemType.PAGE_LAYOUT,
  pageLayoutUniversalIdentifier: SALES_COCKPIT_DASHBOARD_PAGE_LAYOUT_ID,
});
