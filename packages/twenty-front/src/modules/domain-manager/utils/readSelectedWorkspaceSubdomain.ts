import { SELECTED_WORKSPACE_SUBDOMAIN_STORAGE_KEY } from '@/domain-manager/constants/SelectedWorkspaceSubdomainStorageKey';
import { WORKSPACE_SUBDOMAIN_QUERY_PARAM } from '@/domain-manager/constants/WorkspaceSubdomainQueryParam';
import { writeSelectedWorkspaceSubdomain } from '@/domain-manager/utils/writeSelectedWorkspaceSubdomain';
import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'twenty-shared/utils';

// The selection is fixed for the lifetime of a page load: a `?w=<subdomain>`
// parameter wins and is persisted (an empty `?w=` clears it), otherwise the
// persisted value applies. The parameter is removed from the address bar so
// it never leaks into URL-synced states or shared links.
export const readSelectedWorkspaceSubdomain = (): string | null => {
  const url = new URL(window.location.href);
  const subdomainFromUrl = url.searchParams.get(WORKSPACE_SUBDOMAIN_QUERY_PARAM);

  if (isDefined(subdomainFromUrl)) {
    const subdomain = subdomainFromUrl.trim().toLowerCase();

    writeSelectedWorkspaceSubdomain(subdomain);
    url.searchParams.delete(WORKSPACE_SUBDOMAIN_QUERY_PARAM);
    window.history.replaceState(window.history.state, '', url.toString());

    return isNonEmptyString(subdomain) ? subdomain : null;
  }

  try {
    const storedSubdomain = window.localStorage.getItem(
      SELECTED_WORKSPACE_SUBDOMAIN_STORAGE_KEY,
    );

    return isNonEmptyString(storedSubdomain) ? storedSubdomain : null;
  } catch {
    return null;
  }
};
