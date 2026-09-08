import { defineView, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  ALL_STATIONS_VIEW_ID,
  STATION_COUNTRY_FIELD_ID,
  STATION_IATA_CODE_FIELD_ID,
  STATION_IS_HUB_FIELD_ID,
  STATION_NAME_FIELD_ID,
  STATION_REGION_FIELD_ID,
  STATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: ALL_STATIONS_VIEW_ID,
  name: 'All stations',
  objectUniversalIdentifier: STATION_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconPlane',
  position: 0,
  fields: [
    { universalIdentifier: '8515812e-68f1-44ba-b1e9-e390e0303dad', fieldMetadataUniversalIdentifier: STATION_IATA_CODE_FIELD_ID, position: 0, isVisible: true, size: 110 },
    { universalIdentifier: '33c248ff-9148-43c6-b37c-129cac17be8e', fieldMetadataUniversalIdentifier: STATION_NAME_FIELD_ID, position: 1, isVisible: true, size: 220 },
    { universalIdentifier: '371db5da-f5d9-4433-83c4-d7f681fa3858', fieldMetadataUniversalIdentifier: STATION_COUNTRY_FIELD_ID, position: 2, isVisible: true, size: 160 },
    { universalIdentifier: 'ff61e590-325e-4b51-ad4a-a0b93dda7e28', fieldMetadataUniversalIdentifier: STATION_REGION_FIELD_ID, position: 3, isVisible: true, size: 150 },
    { universalIdentifier: '9f9270a3-e553-4464-b56e-f70da750cac4', fieldMetadataUniversalIdentifier: STATION_IS_HUB_FIELD_ID, position: 4, isVisible: true, size: 90 },
  ],
  sorts: [
    { universalIdentifier: 'cab42def-7a32-462b-95dc-8e3203171d5d', fieldMetadataUniversalIdentifier: STATION_IATA_CODE_FIELD_ID, direction: ViewSortDirection.ASC },
  ],
});
