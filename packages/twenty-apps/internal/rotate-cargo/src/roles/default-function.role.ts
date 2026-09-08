import { defineRole } from 'twenty-sdk/define';

import { DEFAULT_ROLE_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

// Role the app's logic functions run under: the sync creates and updates
// initiatives, stations and lanes and reads companies to link forwarders.
export default defineRole({
  universalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Rotate Cargo sync',
  description:
    'Reads companies and writes stations, lanes and Sales Cockpit initiatives.',
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: true,
  canSoftDeleteAllObjectRecords: true,
  canDestroyAllObjectRecords: false,
});
