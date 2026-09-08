import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import {
  LANE_DESTINATION_FIELD_ID,
  LANE_UNIVERSAL_IDENTIFIER,
  STATION_LANES_TO_FIELD_ID,
  STATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: LANE_DESTINATION_FIELD_ID,
  objectUniversalIdentifier: LANE_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'destination',
  label: 'Destination',
  icon: 'IconPlaneArrival',
  relationTargetObjectMetadataUniversalIdentifier: STATION_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: STATION_LANES_TO_FIELD_ID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'destinationId',
  },
});
