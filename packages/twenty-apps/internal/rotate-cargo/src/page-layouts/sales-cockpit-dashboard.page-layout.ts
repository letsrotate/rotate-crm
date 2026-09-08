import {
  AggregateOperations,
  definePageLayout,
  PageLayoutTabLayoutMode,
} from 'twenty-sdk/define';

import {
  SALES_COCKPIT_DASHBOARD_PAGE_LAYOUT_ID,
  SALES_COCKPIT_SYNC_PANEL_FRONT_COMPONENT_ID,
  SALES_INITIATIVE_NAME_FIELD_ID,
  SALES_INITIATIVE_REVENUE_WEEKLY_FIELD_ID,
  SALES_INITIATIVE_STATION_FIELD_ID,
  SALES_INITIATIVE_STATUS_FIELD_ID,
  SALES_INITIATIVE_TARGET_TONNES_FIELD_ID,
  SALES_INITIATIVE_TYPE_FIELD_ID,
  SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

// Chart-config values the SDK doesn't export as enums (passed as literals).
const BAR = {
  layout: 'VERTICAL',
  primaryAxisOrderBy: 'VALUE_DESC',
  axisNameDisplay: 'NONE',
  color: 'auto',
  timezone: 'UTC',
  firstDayOfTheWeek: 1,
} as const;

const OPEN_STATUS_FILTER = {
  recordFilters: [
    {
      fieldMetadataUniversalIdentifier: SALES_INITIATIVE_STATUS_FIELD_ID,
      operand: 'IS',
      value: '["PENDING","ACCEPTED"]',
    },
  ],
};

export default definePageLayout({
  universalIdentifier: SALES_COCKPIT_DASHBOARD_PAGE_LAYOUT_ID,
  name: 'Sales Cockpit',
  type: 'STANDALONE_PAGE',
  tabs: [
    {
      universalIdentifier: 'b2a62ac9-fc52-4e30-a8d1-984bd0d62bb4',
      title: 'Overview',
      position: 0,
      icon: 'IconChartBar',
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: [
        {
          universalIdentifier: 'ff36676b-da42-4144-90db-4a741c1d49d5',
          title: 'Open initiatives',
          type: 'GRAPH',
          objectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
          position: { layoutMode: PageLayoutTabLayoutMode.GRID, row: 0, column: 0, rowSpan: 2, columnSpan: 3 },
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: SALES_INITIATIVE_NAME_FIELD_ID,
            aggregateOperation: AggregateOperations.COUNT,
            displayDataLabel: true,
            timezone: 'UTC',
            firstDayOfTheWeek: 1,
            filter: OPEN_STATUS_FILTER,
          },
        },
        {
          universalIdentifier: 'd32d5250-bf6d-4dde-b1f9-1994265d0400',
          title: 'Target tonnes / week (open)',
          type: 'GRAPH',
          objectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
          position: { layoutMode: PageLayoutTabLayoutMode.GRID, row: 0, column: 3, rowSpan: 2, columnSpan: 3 },
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: SALES_INITIATIVE_TARGET_TONNES_FIELD_ID,
            aggregateOperation: AggregateOperations.SUM,
            displayDataLabel: true,
            timezone: 'UTC',
            firstDayOfTheWeek: 1,
            filter: OPEN_STATUS_FILTER,
          },
        },
        {
          universalIdentifier: '526452da-d55d-45ed-9c56-51e3e3a33e6e',
          title: 'Revenue upside / week (open)',
          type: 'GRAPH',
          objectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
          position: { layoutMode: PageLayoutTabLayoutMode.GRID, row: 0, column: 6, rowSpan: 2, columnSpan: 3 },
          configuration: {
            configurationType: 'AGGREGATE_CHART',
            aggregateFieldMetadataUniversalIdentifier: SALES_INITIATIVE_REVENUE_WEEKLY_FIELD_ID,
            aggregateOperation: AggregateOperations.SUM,
            displayDataLabel: true,
            timezone: 'UTC',
            firstDayOfTheWeek: 1,
            filter: OPEN_STATUS_FILTER,
          },
        },
        {
          universalIdentifier: 'e9606afa-c165-443a-8a01-b754edb40557',
          title: 'Sales Cockpit sync',
          type: 'FRONT_COMPONENT',
          position: { layoutMode: PageLayoutTabLayoutMode.GRID, row: 0, column: 9, rowSpan: 2, columnSpan: 3 },
          configuration: {
            configurationType: 'FRONT_COMPONENT',
            frontComponentUniversalIdentifier: SALES_COCKPIT_SYNC_PANEL_FRONT_COMPONENT_ID,
          },
        },
        {
          universalIdentifier: 'ec71a32c-5760-4405-b1d0-b05edbc887be',
          title: 'Initiatives by status',
          type: 'GRAPH',
          objectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
          position: { layoutMode: PageLayoutTabLayoutMode.GRID, row: 2, column: 0, rowSpan: 5, columnSpan: 4 },
          configuration: {
            configurationType: 'PIE_CHART',
            aggregateFieldMetadataUniversalIdentifier: SALES_INITIATIVE_NAME_FIELD_ID,
            aggregateOperation: AggregateOperations.COUNT,
            groupByFieldMetadataUniversalIdentifier: SALES_INITIATIVE_STATUS_FIELD_ID,
            displayLegend: true,
            timezone: 'UTC',
            firstDayOfTheWeek: 1,
          },
        },
        {
          universalIdentifier: 'f5bed2ea-aa1e-49df-8306-ab2cac637723',
          title: 'Target tonnes by type',
          type: 'GRAPH',
          objectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
          position: { layoutMode: PageLayoutTabLayoutMode.GRID, row: 2, column: 4, rowSpan: 5, columnSpan: 4 },
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: SALES_INITIATIVE_TARGET_TONNES_FIELD_ID,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: SALES_INITIATIVE_TYPE_FIELD_ID,
            ...BAR,
          },
        },
        {
          universalIdentifier: 'a04df0ea-f650-46d1-a3d4-7075300adc3f',
          title: 'Target tonnes by station',
          type: 'GRAPH',
          objectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
          position: { layoutMode: PageLayoutTabLayoutMode.GRID, row: 2, column: 8, rowSpan: 5, columnSpan: 4 },
          configuration: {
            configurationType: 'BAR_CHART',
            aggregateFieldMetadataUniversalIdentifier: SALES_INITIATIVE_TARGET_TONNES_FIELD_ID,
            aggregateOperation: AggregateOperations.SUM,
            primaryAxisGroupByFieldMetadataUniversalIdentifier: SALES_INITIATIVE_STATION_FIELD_ID,
            ...BAR,
          },
        },
      ],
    },
  ],
});
