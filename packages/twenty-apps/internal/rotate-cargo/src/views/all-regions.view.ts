import { defineView, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  ALL_REGIONS_VIEW_ID,
  REGION_CODE_FIELD_ID,
  REGION_NAME_FIELD_ID,
  REGION_REGIONAL_MANAGER_FIELD_ID,
  REGION_STATIONS_FIELD_ID,
  REGION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: ALL_REGIONS_VIEW_ID,
  name: 'All regions',
  objectUniversalIdentifier: REGION_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconWorld',
  position: 0,
  fields: [
    { universalIdentifier: '42118fe0-9966-4764-96d8-b2ac14281576', fieldMetadataUniversalIdentifier: REGION_NAME_FIELD_ID, position: 0, isVisible: true, size: 200 },
    { universalIdentifier: 'e39fa927-0ec6-411d-93a5-d4252289ddbc', fieldMetadataUniversalIdentifier: REGION_CODE_FIELD_ID, position: 1, isVisible: true, size: 90 },
    { universalIdentifier: 'a5e49d67-1bba-4f1e-a0c2-cce8e9964460', fieldMetadataUniversalIdentifier: REGION_REGIONAL_MANAGER_FIELD_ID, position: 2, isVisible: true, size: 200 },
    { universalIdentifier: '5c1c434d-0b63-4aa7-9ce6-6c39ae4cf300', fieldMetadataUniversalIdentifier: REGION_STATIONS_FIELD_ID, position: 3, isVisible: true, size: 320 },
  ],
  sorts: [
    { universalIdentifier: '9c318da2-1dc0-4ac7-b217-531ae0bad924', fieldMetadataUniversalIdentifier: REGION_NAME_FIELD_ID, direction: ViewSortDirection.ASC },
  ],
});
