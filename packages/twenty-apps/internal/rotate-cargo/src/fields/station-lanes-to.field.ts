import { defineField, FieldType, RelationType } from 'twenty-sdk/define';

import {
  LANE_DESTINATION_FIELD_ID,
  LANE_UNIVERSAL_IDENTIFIER,
  STATION_LANES_TO_FIELD_ID,
  STATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: STATION_LANES_TO_FIELD_ID,
  objectUniversalIdentifier: STATION_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'lanesTo',
  label: 'Lanes to here',
  icon: 'IconPlaneArrival',
  relationTargetObjectMetadataUniversalIdentifier: LANE_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: LANE_DESTINATION_FIELD_ID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
