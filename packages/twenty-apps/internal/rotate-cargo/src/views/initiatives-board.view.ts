import { defineView, ViewType } from 'twenty-sdk/define';

import {
  INITIATIVES_BOARD_VIEW_ID,
  SALES_INITIATIVE_FORWARDER_FIELD_ID,
  SALES_INITIATIVE_LANE_FIELD_ID,
  SALES_INITIATIVE_NAME_FIELD_ID,
  SALES_INITIATIVE_REVENUE_WEEKLY_FIELD_ID,
  SALES_INITIATIVE_STATUS_FIELD_ID,
  SALES_INITIATIVE_TARGET_TONNES_FIELD_ID,
  SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';
import { SALES_INITIATIVE_STATUS_OPTIONS } from 'src/objects/sales-initiative.object';

const GROUP_IDS = [
  'be764742-b3a1-426c-92cf-934c4d7f6f49',
  'ba5b42e0-30d0-48d0-a68e-27b5993b6b28',
  '48cf2d79-7319-4cca-895c-10aee1e8a522',
  'e8217642-c642-441c-90a3-afcdecb98217',
  'e7f11610-d6aa-464a-aeca-a485ebc39916',
  '0a9ead76-7211-4c4c-b2d5-a467089ed5fb',
  '25f4b931-a422-40ec-a5df-c1e738dbe1e6',
];

export default defineView({
  universalIdentifier: INITIATIVES_BOARD_VIEW_ID,
  name: 'Initiatives board',
  objectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 2,
  mainGroupByFieldMetadataUniversalIdentifier: SALES_INITIATIVE_STATUS_FIELD_ID,
  fields: [
    { universalIdentifier: 'b0b42f15-1fcf-4b2a-984a-58051439b89d', fieldMetadataUniversalIdentifier: SALES_INITIATIVE_NAME_FIELD_ID, position: 0, isVisible: true, size: 220 },
    { universalIdentifier: '404d6954-0a89-45e6-a8fd-910edb37f934', fieldMetadataUniversalIdentifier: SALES_INITIATIVE_FORWARDER_FIELD_ID, position: 1, isVisible: true, size: 180 },
    { universalIdentifier: '77b13919-56f2-4e76-8002-71fd5ef1efc6', fieldMetadataUniversalIdentifier: SALES_INITIATIVE_LANE_FIELD_ID, position: 2, isVisible: true, size: 120 },
    { universalIdentifier: '3f37b754-a647-4af1-a04e-f367f6a03f00', fieldMetadataUniversalIdentifier: SALES_INITIATIVE_TARGET_TONNES_FIELD_ID, position: 3, isVisible: true, size: 140 },
    { universalIdentifier: 'cb4144f5-e0b8-4333-bc1a-12a7fe93c1bb', fieldMetadataUniversalIdentifier: SALES_INITIATIVE_REVENUE_WEEKLY_FIELD_ID, position: 4, isVisible: true, size: 160 },
  ],
  groups: SALES_INITIATIVE_STATUS_OPTIONS.map((option, index) => ({
    universalIdentifier: GROUP_IDS[index],
    fieldValue: option.value,
    position: index,
    // Archived cards are noise on a working board.
    isVisible: option.value !== 'ARCHIVED',
  })),
});
