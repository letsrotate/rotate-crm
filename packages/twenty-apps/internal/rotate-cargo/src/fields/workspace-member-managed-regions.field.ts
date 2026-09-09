import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  REGION_REGIONAL_MANAGER_FIELD_ID,
  REGION_UNIVERSAL_IDENTIFIER,
  WORKSPACE_MEMBER_MANAGED_REGIONS_FIELD_ID,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: WORKSPACE_MEMBER_MANAGED_REGIONS_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'managedRegions',
  label: 'Managed regions',
  icon: 'IconWorld',
  relationTargetObjectMetadataUniversalIdentifier: REGION_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    REGION_REGIONAL_MANAGER_FIELD_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
