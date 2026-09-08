import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  COMPANY_SALES_INITIATIVES_FIELD_ID,
  SALES_INITIATIVE_FORWARDER_FIELD_ID,
  SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_SALES_INITIATIVES_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'salesInitiatives',
  label: 'Sales initiatives',
  icon: 'IconTargetArrow',
  relationTargetObjectMetadataUniversalIdentifier:
    SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    SALES_INITIATIVE_FORWARDER_FIELD_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
