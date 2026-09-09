import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import {
  REGION_STATIONS_FIELD_ID,
  REGION_UNIVERSAL_IDENTIFIER,
  STATION_SALES_REGION_FIELD_ID,
  STATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: STATION_SALES_REGION_FIELD_ID,
  objectUniversalIdentifier: STATION_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'salesRegion',
  label: 'Sales region',
  icon: 'IconWorld',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: REGION_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: REGION_STATIONS_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'salesRegionId',
  },
});
