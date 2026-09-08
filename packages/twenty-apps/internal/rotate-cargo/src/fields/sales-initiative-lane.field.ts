import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import {
  LANE_SALES_INITIATIVES_FIELD_ID,
  LANE_UNIVERSAL_IDENTIFIER,
  SALES_INITIATIVE_LANE_FIELD_ID,
  SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: SALES_INITIATIVE_LANE_FIELD_ID,
  objectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'lane',
  label: 'Lane',
  icon: 'IconRoute',
  relationTargetObjectMetadataUniversalIdentifier: LANE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: LANE_SALES_INITIATIVES_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'laneId',
  },
});
