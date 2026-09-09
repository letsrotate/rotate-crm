import { useWorkspaceSelection } from '@/domain-manager/hooks/useWorkspaceSelection';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { lastAuthenticatedWorkspaceDomainState } from '@/domain-manager/states/lastAuthenticatedWorkspaceDomainState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';

export const useLastAuthenticatedWorkspaceDomain = () => {
  const domainConfiguration = useAtomStateValue(domainConfigurationState);
  const { isSingleHostMode } = useWorkspaceSelection();
  const setLastAuthenticatedWorkspaceDomain = useSetAtomState(
    lastAuthenticatedWorkspaceDomainState,
  );
  const setLastAuthenticateWorkspaceDomainWithCookieAttributes = (
    params: { workspaceId: string; workspaceUrl: string } | null,
  ) => {
    setLastAuthenticatedWorkspaceDomain({
      ...(params ? params : {}),
      // With a single host there is no subdomain to share the cookie with.
      cookieAttributes: isSingleHostMode
        ? {}
        : {
            domain: `.${domainConfiguration.frontDomain}`,
          },
    });
  };

  return {
    setLastAuthenticateWorkspaceDomain:
      setLastAuthenticateWorkspaceDomainWithCookieAttributes,
  };
};
