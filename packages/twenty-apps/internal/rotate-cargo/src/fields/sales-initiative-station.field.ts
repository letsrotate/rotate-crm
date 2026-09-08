import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import {
  SALES_INITIATIVE_STATION_FIELD_ID,
  SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
  STATION_SALES_INITIATIVES_FIELD_ID,
  STATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: SALES_INITIATIVE_STATION_FIELD_ID,
  objectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'station',
  label: 'Station',
  icon: 'IconPlane',
  relationTargetObjectMetadataUniversalIdentifier: STATION_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    STATION_SALES_INITIATIVES_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'stationId',
  },
});
