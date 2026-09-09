import { WORKSPACE_SUBDOMAIN_QUERY_PARAM } from '@/domain-manager/constants/WorkspaceSubdomainQueryParam';
import { useWorkspaceSelection } from '@/domain-manager/hooks/useWorkspaceSelection';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { AppPath } from 'twenty-shared/types';

// Same signal the in-app "Create Workspace" entry uses (useAuth): an existing
// user lands on the workspace creation form instead of the workspace picker.
const CREATE_WORKSPACE_SEARCH = '?action=create-new-workspace';

// frontDomain carries no port (it is "localhost" in dev), so the current
// port is re-applied; in production there is none.
export const useRotateLandingUrls = () => {
  const { frontDomain, defaultSubdomain } = useAtomStateValue(
    domainConfigurationState,
  );
  const { isSingleHostMode } = useWorkspaceSelection();

  const { protocol, port } = window.location;
  const portSuffix = port.length > 0 ? `:${port}` : '';

  const originForSubdomain = (subdomain: string) =>
    `${protocol}//${subdomain}.${frontDomain}${portSuffix}`;

  if (isSingleHostMode) {
    return {
      isSingleHostMode,
      signInUrl: AppPath.SignInUp,
      createWorkspaceUrl: `${AppPath.SignInUp}${CREATE_WORKSPACE_SEARCH}`,
      workspaceUrl: (subdomain: string) =>
        `/?${WORKSPACE_SUBDOMAIN_QUERY_PARAM}=${encodeURIComponent(subdomain)}`,
    };
  }

  return {
    isSingleHostMode,
    signInUrl: `${originForSubdomain(defaultSubdomain ?? 'app')}${AppPath.SignInUp}`,
    createWorkspaceUrl: `${originForSubdomain(defaultSubdomain ?? 'app')}${AppPath.SignInUp}${CREATE_WORKSPACE_SEARCH}`,
    workspaceUrl: originForSubdomain,
  };
};
