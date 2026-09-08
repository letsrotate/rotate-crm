import {
  definePageLayoutTab,
  PageLayoutTabLayoutMode,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  COMPANY_SALES_COCKPIT_TAB_ID,
  FORWARDER_INITIATIVES_FRONT_COMPONENT_ID,
} from 'src/constants/universal-identifiers';

// Adds a "Sales Cockpit" tab to every company (forwarder) record page.
export default definePageLayoutTab({
  universalIdentifier: COMPANY_SALES_COCKPIT_TAB_ID,
  pageLayoutUniversalIdentifier:
    STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.companyRecordPage.universalIdentifier,
  title: 'Sales Cockpit',
  position: 150,
  icon: 'IconTargetArrow',
  layoutMode: PageLayoutTabLayoutMode.CANVAS,
  widgets: [
    {
      universalIdentifier: '7d7f3ae5-c3db-4291-af28-ae17d926918b',
      title: 'Initiatives for this forwarder',
      type: 'FRONT_COMPONENT',
      configuration: {
        configurationType: 'FRONT_COMPONENT',
        frontComponentUniversalIdentifier:
          FORWARDER_INITIATIVES_FRONT_COMPONENT_ID,
      },
    },
  ],
});
