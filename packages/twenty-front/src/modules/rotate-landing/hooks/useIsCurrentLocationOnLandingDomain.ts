import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isNonEmptyString } from '@sniptt/guards';

// The bare apex (crm.letsrotate.com) is neither the default domain
// (app.crm.letsrotate.com) nor a workspace subdomain, so in multi-workspace
// mode it is free to serve the Rotate landing page.
export const useIsCurrentLocationOnLandingDomain = () => {
  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );
  const { frontDomain } = useAtomStateValue(domainConfigurationState);

  const isLandingDomain =
    isMultiWorkspaceEnabled &&
    isNonEmptyString(frontDomain) &&
    window.location.hostname === frontDomain;

  return { isLandingDomain };
};
