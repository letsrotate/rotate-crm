import { defineView, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  ALL_LANES_VIEW_ID,
  LANE_DESTINATION_FIELD_ID,
  LANE_LEG_COLOUR_FIELD_ID,
  LANE_NAME_FIELD_ID,
  LANE_ORIGIN_FIELD_ID,
  LANE_UNIVERSAL_IDENTIFIER,
  LANE_WEEKLY_TONNES_AIRLINE_FIELD_ID,
  LANE_WEEKLY_TONNES_MARKET_FIELD_ID,
  LANE_YIELD_AIRLINE_FIELD_ID,
  LANE_YIELD_MARKET_FIELD_ID,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: ALL_LANES_VIEW_ID,
  name: 'All lanes',
  objectUniversalIdentifier: LANE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconRoute',
  position: 0,
  fields: [
    { universalIdentifier: '23f4e9ba-afc0-48d2-b657-da8803e56d92', fieldMetadataUniversalIdentifier: LANE_NAME_FIELD_ID, position: 0, isVisible: true, size: 130 },
    { universalIdentifier: '7c6bdac0-8d3b-4c3f-847d-9e3e9a8879ed', fieldMetadataUniversalIdentifier: LANE_ORIGIN_FIELD_ID, position: 1, isVisible: true, size: 120 },
    { universalIdentifier: 'ad9171e4-c09c-49c0-9084-36cfd2ab48b9', fieldMetadataUniversalIdentifier: LANE_DESTINATION_FIELD_ID, position: 2, isVisible: true, size: 120 },
    { universalIdentifier: '41ed69c6-cbe2-443f-89c5-7a337ba8c6f0', fieldMetadataUniversalIdentifier: LANE_LEG_COLOUR_FIELD_ID, position: 3, isVisible: true, size: 120 },
    { universalIdentifier: '1b0cb1e7-d05b-4af7-a04e-09adcba39c80', fieldMetadataUniversalIdentifier: LANE_WEEKLY_TONNES_AIRLINE_FIELD_ID, position: 4, isVisible: true, size: 150 },
    { universalIdentifier: '3e64d885-0b3b-4fc0-b7e9-706ed0348f74', fieldMetadataUniversalIdentifier: LANE_WEEKLY_TONNES_MARKET_FIELD_ID, position: 5, isVisible: true, size: 150 },
    { universalIdentifier: '85bfccce-1b7a-4563-8f41-49acc26962bb', fieldMetadataUniversalIdentifier: LANE_YIELD_AIRLINE_FIELD_ID, position: 6, isVisible: true, size: 150 },
    { universalIdentifier: '25f32007-8bd1-4a53-9f83-c1398c80f2fd', fieldMetadataUniversalIdentifier: LANE_YIELD_MARKET_FIELD_ID, position: 7, isVisible: true, size: 150 },
  ],
  sorts: [
    { universalIdentifier: '491b7ebf-af5a-44f5-bcb2-f9315f5d6588', fieldMetadataUniversalIdentifier: LANE_NAME_FIELD_ID, direction: ViewSortDirection.ASC },
  ],
});
