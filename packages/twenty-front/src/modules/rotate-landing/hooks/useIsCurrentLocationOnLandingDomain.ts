import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { useWorkspaceSelection } from '@/domain-manager/hooks/useWorkspaceSelection';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'twenty-shared/utils';

// With subdomain routing, the bare apex (crm.letsrotate.com) is neither the
// default domain nor a workspace, so it serves the Rotate landing page. With
// a single host, the landing page is the root path while no workspace is
// selected; every other path belongs to the sign-in / onboarding flows.
export const useIsCurrentLocationOnLandingDomain = () => {
  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );
  const { frontDomain } = useAtomStateValue(domainConfigurationState);
  const { isSingleHostMode, selectedWorkspaceSubdomain } =
    useWorkspaceSelection();

  if (isSingleHostMode) {
    return {
      isLandingDomain:
        !isDefined(selectedWorkspaceSubdomain) &&
        window.location.pathname === '/',
    };
  }

  const isLandingDomain =
    isMultiWorkspaceEnabled &&
    isNonEmptyString(frontDomain) &&
    window.location.hostname === frontDomain;

  return { isLandingDomain };
};
