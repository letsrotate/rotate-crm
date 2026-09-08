import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import {
  SALES_INITIATIVE_STATION_FIELD_ID,
  SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
  STATION_SALES_INITIATIVES_FIELD_ID,
  STATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: STATION_SALES_INITIATIVES_FIELD_ID,
  objectUniversalIdentifier: STATION_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'salesInitiatives',
  label: 'Sales initiatives',
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    SALES_INITIATIVE_STATION_FIELD_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
