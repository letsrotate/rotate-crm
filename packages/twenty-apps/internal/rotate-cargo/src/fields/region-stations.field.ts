import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import {
  REGION_STATIONS_FIELD_ID,
  REGION_UNIVERSAL_IDENTIFIER,
  STATION_SALES_REGION_FIELD_ID,
  STATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: REGION_STATIONS_FIELD_ID,
  objectUniversalIdentifier: REGION_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'stations',
  label: 'Stations',
  icon: 'IconPlane',
  relationTargetObjectMetadataUniversalIdentifier: STATION_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: STATION_SALES_REGION_FIELD_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
