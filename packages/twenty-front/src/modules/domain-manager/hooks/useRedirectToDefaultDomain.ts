import { returnToPathState } from '@/auth/states/returnToPathState';
import { WORKSPACE_SUBDOMAIN_QUERY_PARAM } from '@/domain-manager/constants/WorkspaceSubdomainQueryParam';
import { useLastAuthenticatedWorkspaceDomain } from '@/domain-manager/hooks/useLastAuthenticatedWorkspaceDomain';
import { useReadDefaultDomainFromConfiguration } from '@/domain-manager/hooks/useReadDefaultDomainFromConfiguration';
import { useRedirect } from '@/domain-manager/hooks/useRedirect';
import { useWorkspaceSelection } from '@/domain-manager/hooks/useWorkspaceSelection';
import { writeSelectedWorkspaceSubdomain } from '@/domain-manager/utils/writeSelectedWorkspaceSubdomain';
import { isNonEmptyString } from '@sniptt/guards';
import { useStore } from 'jotai';
import { isDefined } from 'twenty-shared/utils';

export const useRedirectToDefaultDomain = () => {
  const { defaultDomain } = useReadDefaultDomainFromConfiguration();
  const { setLastAuthenticateWorkspaceDomain } =
    useLastAuthenticatedWorkspaceDomain();
  const { isSingleHostMode, selectedWorkspaceSubdomain } =
    useWorkspaceSelection();
  const store = useStore();

  const { redirect } = useRedirect();
  const redirectToDefaultDomain = (options?: {
    pathname?: string;
    searchParams?: Record<string, string>;
  }) => {
    const url = new URL(window.location.href);

    const isOnDefaultDomain = isSingleHostMode
      ? !isDefined(selectedWorkspaceSubdomain)
      : url.hostname === defaultDomain;

    if (!isOnDefaultDomain) {
      setLastAuthenticateWorkspaceDomain(null);

      const returnToPath = store.get(returnToPathState.atom);
      if (
        isNonEmptyString(returnToPath) &&
        !url.searchParams.has('returnToPath')
      ) {
        url.searchParams.set('returnToPath', returnToPath);
      }

      if (isNonEmptyString(options?.pathname)) {
        url.pathname = options.pathname;
      }

      Object.entries(options?.searchParams ?? {}).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });

      if (isSingleHostMode) {
        writeSelectedWorkspaceSubdomain(null);
        url.searchParams.set(WORKSPACE_SUBDOMAIN_QUERY_PARAM, '');
      } else {
        url.hostname = defaultDomain;
      }

      redirect(url.toString());
    }
  };

  return {
    redirectToDefaultDomain,
  };
};
