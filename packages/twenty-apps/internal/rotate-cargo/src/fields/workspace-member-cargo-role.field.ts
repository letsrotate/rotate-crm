import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { WORKSPACE_MEMBER_CARGO_ROLE_FIELD_ID } from 'src/constants/universal-identifiers';

export const CARGO_ROLE_OPTIONS = [
  { id: '4d834d39-f8c2-4628-8f9a-67332ef65c74', value: 'HEAD_OF_SALES', label: 'Head of cargo sales', position: 0, color: 'purple' },
  { id: '0e3a49ff-2549-4844-9137-e7e0cf75f4a4', value: 'REGIONAL_MANAGER', label: 'Regional manager', position: 1, color: 'blue' },
  { id: 'a5a3ab32-642f-4e47-84d6-c73aba80e231', value: 'STATION_MANAGER', label: 'Station manager', position: 2, color: 'turquoise' },
  { id: '91df5ffd-302c-4b66-994f-793d9ff83775', value: 'ACCOUNT_MANAGER', label: 'Account manager', position: 3, color: 'green' },
  { id: '6c33b43f-ff77-4666-9583-90ad8e8f8068', value: 'PLATFORM_ADMIN', label: 'Platform admin', position: 4, color: 'gray' },
] as const;

export default defineField({
  universalIdentifier: WORKSPACE_MEMBER_CARGO_ROLE_FIELD_ID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.SELECT,
  name: 'cargoRole',
  label: 'Cargo sales role',
  description: 'Place in the sales organisation',
  icon: 'IconHierarchy',
  isNullable: true,
  options: [...CARGO_ROLE_OPTIONS],
});
