import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  STATION_ACCOUNT_MANAGERS_FIELD_ID,
  STATION_UNIVERSAL_IDENTIFIER,
  WORKSPACE_MEMBER_STATION_FIELD_ID,
} from 'src/constants/universal-identifiers';

// Where an account manager sits; the Sales Cockpit assigns initiatives per
// station + agent, so this is what turns a synced assignee into a person.
export default defineField({
  universalIdentifier: WORKSPACE_MEMBER_STATION_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'station',
  label: 'Station',
  icon: 'IconPlane',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: STATION_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    STATION_ACCOUNT_MANAGERS_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'stationId',
  },
});
