import {
  defineView,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import {
  OPEN_INITIATIVES_VIEW_ID,
  SALES_INITIATIVE_REVENUE_WEEKLY_FIELD_ID,
  SALES_INITIATIVE_STATUS_FIELD_ID,
  SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';
import { SALES_INITIATIVE_TABLE_VIEW_FIELDS } from 'src/views/all-initiatives.view';

// What an account manager works on: cards not yet actioned or being pursued.
export default defineView({
  universalIdentifier: OPEN_INITIATIVES_VIEW_ID,
  name: 'Open initiatives',
  objectUniversalIdentifier: SALES_INITIATIVE_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconFlag',
  position: 1,
  fields: SALES_INITIATIVE_TABLE_VIEW_FIELDS('2f85179a-53d4-4b31-a543-096133106af'),
  filters: [
    {
      universalIdentifier: 'cd07c927-b4cf-47e9-912f-103073a96d87',
      fieldMetadataUniversalIdentifier: SALES_INITIATIVE_STATUS_FIELD_ID,
      operand: ViewFilterOperand.IS,
      value: ['PENDING', 'ACCEPTED'],
    },
  ],
  sorts: [
    { universalIdentifier: '3a785087-d27d-4e86-8fc6-954196de7b0b', fieldMetadataUniversalIdentifier: SALES_INITIATIVE_REVENUE_WEEKLY_FIELD_ID, direction: ViewSortDirection.DESC },
  ],
});
