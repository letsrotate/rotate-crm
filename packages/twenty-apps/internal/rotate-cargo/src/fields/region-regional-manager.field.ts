import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  REGION_REGIONAL_MANAGER_FIELD_ID,
  REGION_UNIVERSAL_IDENTIFIER,
  WORKSPACE_MEMBER_MANAGED_REGIONS_FIELD_ID,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: REGION_REGIONAL_MANAGER_FIELD_ID,
  objectUniversalIdentifier: REGION_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'regionalManager',
  label: 'Regional manager',
  icon: 'IconUserStar',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    WORKSPACE_MEMBER_MANAGED_REGIONS_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'regionalManagerId',
  },
});
