import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  SALES_INITIATIVE_ASSIGNEE_FIELD_ID,
  SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
  WORKSPACE_MEMBER_SALES_INITIATIVES_FIELD_ID,
} from 'src/constants/universal-identifiers';

// Resolved by the sync from the cockpit assignee email.
export default defineField({
  universalIdentifier: SALES_INITIATIVE_ASSIGNEE_FIELD_ID,
  objectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'assignee',
  label: 'Assignee',
  icon: 'IconUser',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    WORKSPACE_MEMBER_SALES_INITIATIVES_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'assigneeId',
  },
});
