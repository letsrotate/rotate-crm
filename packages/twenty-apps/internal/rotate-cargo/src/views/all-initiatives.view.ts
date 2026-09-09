import { defineView, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  ALL_INITIATIVES_VIEW_ID,
  SALES_INITIATIVE_ASSIGNEE_FIELD_ID,
  SALES_INITIATIVE_FORWARDER_FIELD_ID,
  SALES_INITIATIVE_LANE_FIELD_ID,
  SALES_INITIATIVE_NAME_FIELD_ID,
  SALES_INITIATIVE_REVENUE_WEEKLY_FIELD_ID,
  SALES_INITIATIVE_RUN_TIMESTAMP_FIELD_ID,
  SALES_INITIATIVE_STATION_FIELD_ID,
  SALES_INITIATIVE_STATUS_FIELD_ID,
  SALES_INITIATIVE_TARGET_TONNES_FIELD_ID,
  SALES_INITIATIVE_TARGET_YIELD_FIELD_ID,
  SALES_INITIATIVE_TYPE_FIELD_ID,
  SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export const SALES_INITIATIVE_TABLE_VIEW_FIELDS = (prefix: string) => [
  { universalIdentifier: `${prefix}1`, fieldMetadataUniversalIdentifier: SALES_INITIATIVE_NAME_FIELD_ID, position: 0, isVisible: true, size: 280 },
  { universalIdentifier: `${prefix}2`, fieldMetadataUniversalIdentifier: SALES_INITIATIVE_STATUS_FIELD_ID, position: 1, isVisible: true, size: 120 },
  { universalIdentifier: `${prefix}3`, fieldMetadataUniversalIdentifier: SALES_INITIATIVE_TYPE_FIELD_ID, position: 2, isVisible: true, size: 100 },
  { universalIdentifier: `${prefix}4`, fieldMetadataUniversalIdentifier: SALES_INITIATIVE_FORWARDER_FIELD_ID, position: 3, isVisible: true, size: 200 },
  { universalIdentifier: `${prefix}5`, fieldMetadataUniversalIdentifier: SALES_INITIATIVE_STATION_FIELD_ID, position: 4, isVisible: true, size: 100 },
  { universalIdentifier: `${prefix}6`, fieldMetadataUniversalIdentifier: SALES_INITIATIVE_LANE_FIELD_ID, position: 5, isVisible: true, size: 120 },
  { universalIdentifier: `${prefix}7`, fieldMetadataUniversalIdentifier: SALES_INITIATIVE_TARGET_TONNES_FIELD_ID, position: 6, isVisible: true, size: 140 },
  { universalIdentifier: `${prefix}8`, fieldMetadataUniversalIdentifier: SALES_INITIATIVE_TARGET_YIELD_FIELD_ID, position: 7, isVisible: true, size: 140 },
  { universalIdentifier: `${prefix}9`, fieldMetadataUniversalIdentifier: SALES_INITIATIVE_REVENUE_WEEKLY_FIELD_ID, position: 8, isVisible: true, size: 160 },
  { universalIdentifier: `${prefix}a`, fieldMetadataUniversalIdentifier: SALES_INITIATIVE_ASSIGNEE_FIELD_ID, position: 9, isVisible: true, size: 180 },
  { universalIdentifier: `${prefix}b`, fieldMetadataUniversalIdentifier: SALES_INITIATIVE_RUN_TIMESTAMP_FIELD_ID, position: 10, isVisible: true, size: 160 },
];

export default defineView({
  universalIdentifier: ALL_INITIATIVES_VIEW_ID,
  name: 'All initiatives',
  objectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconTargetArrow',
  position: 0,
  // View-field identifiers must be UUIDs; the prefix is 35 chars + 1 suffix.
  fields: SALES_INITIATIVE_TABLE_VIEW_FIELDS('04c89e75-dde5-4e34-b37f-64e686acdf9'),
  sorts: [
    { universalIdentifier: '8743b983-4a14-4a66-ae00-4945af180ef4', fieldMetadataUniversalIdentifier: SALES_INITIATIVE_RUN_TIMESTAMP_FIELD_ID, direction: ViewSortDirection.DESC },
  ],
});
