import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  STATION_ACCOUNT_MANAGERS_FIELD_ID,
  STATION_UNIVERSAL_IDENTIFIER,
  WORKSPACE_MEMBER_STATION_FIELD_ID,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: STATION_ACCOUNT_MANAGERS_FIELD_ID,
  objectUniversalIdentifier: STATION_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'accountManagers',
  label: 'Account managers',
  icon: 'IconUsers',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    WORKSPACE_MEMBER_STATION_FIELD_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
