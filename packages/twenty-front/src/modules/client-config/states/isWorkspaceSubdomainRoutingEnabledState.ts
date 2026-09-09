import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

// Rotate fork: false means every workspace is served from the front URL and
// selected client-side instead of by hostname.
export const isWorkspaceSubdomainRoutingEnabledState = createAtomState<boolean>(
  {
    key: 'isWorkspaceSubdomainRoutingEnabled',
    defaultValue: true,
  },
);
