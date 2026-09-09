import {
  defineApplicationRole,
  SystemPermissionFlag,
} from 'twenty-sdk/define';

import { DEFAULT_ROLE_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

// Role the app's logic functions run under: the sync creates and updates
// initiatives, stations and lanes and reads companies to link forwarders.
export default defineApplicationRole({
  universalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Rotate Cargo sync',
  description:
    'Reads companies, writes stations, lanes and Sales Cockpit initiatives, and sets cargo roles on members.',
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: true,
  canSoftDeleteAllObjectRecords: true,
  canDestroyAllObjectRecords: false,
  // The sync and the demo seed set cargoRole / station on workspace members,
  // which is a settings-level write.
  permissionFlagUniversalIdentifiers: [SystemPermissionFlag.WORKSPACE_MEMBERS],
});
