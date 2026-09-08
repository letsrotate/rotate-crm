import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  COMPANY_SALES_INITIATIVES_FIELD_ID,
  SALES_INITIATIVE_FORWARDER_FIELD_ID,
  SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

// Forwarders are plain Companies; the sync links by salesCockpitAgentName.
export default defineField({
  universalIdentifier: SALES_INITIATIVE_FORWARDER_FIELD_ID,
  objectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'forwarder',
  label: 'Forwarder',
  icon: 'IconBuildingSkyscraper',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    COMPANY_SALES_INITIATIVES_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'forwarderId',
  },
});
