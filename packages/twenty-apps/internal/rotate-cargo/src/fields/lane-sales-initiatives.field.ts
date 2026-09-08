import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import {
  LANE_SALES_INITIATIVES_FIELD_ID,
  LANE_UNIVERSAL_IDENTIFIER,
  SALES_INITIATIVE_LANE_FIELD_ID,
  SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: LANE_SALES_INITIATIVES_FIELD_ID,
  objectUniversalIdentifier: LANE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'salesInitiatives',
  label: 'Sales initiatives',
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: SALES_INITIATIVE_LANE_FIELD_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
