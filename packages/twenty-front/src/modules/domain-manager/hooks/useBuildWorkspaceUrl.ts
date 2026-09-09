import { WORKSPACE_SUBDOMAIN_QUERY_PARAM } from '@/domain-manager/constants/WorkspaceSubdomainQueryParam';
import { useWorkspaceSelection } from '@/domain-manager/hooks/useWorkspaceSelection';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isDefined } from 'twenty-shared/utils';

export const useBuildWorkspaceUrl = () => {
  const { isSingleHostMode, getSubdomainFromVirtualUrl } =
    useWorkspaceSelection();
  const { defaultSubdomain } = useAtomStateValue(domainConfigurationState);

  const buildWorkspaceUrl = (
    endpoint: string,
    pathname?: string,
    searchParams?: Record<string, string | boolean>,
  ) => {
    const url = new URL(endpoint);

    // Virtual workspace origins become the real front origin plus the
    // workspace parameter; the default subdomain maps to "no workspace".
    const virtualSubdomain = isSingleHostMode
      ? getSubdomainFromVirtualUrl(endpoint)
      : undefined;

    if (isDefined(virtualSubdomain)) {
      const realUrl = new URL(window.location.origin);

      realUrl.pathname = url.pathname;
      realUrl.search = url.search;
      realUrl.hash = url.hash;
      realUrl.searchParams.set(
        WORKSPACE_SUBDOMAIN_QUERY_PARAM,
        virtualSubdomain === defaultSubdomain ? '' : virtualSubdomain,
      );

      return buildWorkspaceUrl(realUrl.toString(), pathname, searchParams);
    }

    if (isDefined(pathname)) {
      url.pathname = pathname;
    }

    if (isDefined(searchParams)) {
      Object.entries(searchParams).forEach(([key, value]) =>
        url.searchParams.set(key, value.toString()),
      );
    }
    return url.toString();
  };

  return {
    buildWorkspaceUrl,
  };
};
