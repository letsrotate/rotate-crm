import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_FORWARDER_TIER_FIELD_ID } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_FORWARDER_TIER_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'forwarderTier',
  label: 'Forwarder tier',
  description: 'Weekly tonnage bucket: very large ≥ 50 t, large ≥ 25 t, medium ≥ 5 t, small < 5 t',
  icon: 'IconStairs',
  isNullable: true,
  options: [
    { id: '70e07bc5-5acf-4e00-ba51-7610e164b9ae', value: 'VERY_LARGE', label: 'Very large', position: 0, color: 'blue' },
    { id: 'a7ce2ef7-2049-4a6d-bc73-b10409fb5290', value: 'LARGE', label: 'Large', position: 1, color: 'green' },
    { id: 'f6372d16-1220-43a9-bbc3-a4b1f91243ae', value: 'MEDIUM', label: 'Medium', position: 2, color: 'yellow' },
    { id: 'd2081b11-fdf2-49c6-8d16-313a6d0c6d1e', value: 'SMALL', label: 'Small', position: 3, color: 'gray' },
  ],
});
