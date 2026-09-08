import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_IATA_CASS_CODE_FIELD_ID } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_IATA_CASS_CODE_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'iataCassCode',
  label: 'IATA CASS code',
  description: 'IATA agent code (CASS), the industry key for a forwarder branch',
  icon: 'IconHash',
  isNullable: true,
});
