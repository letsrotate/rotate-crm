import { SELECTED_WORKSPACE_SUBDOMAIN_STORAGE_KEY } from '@/domain-manager/constants/SelectedWorkspaceSubdomainStorageKey';
import { isNonEmptyString } from '@sniptt/guards';

export const writeSelectedWorkspaceSubdomain = (subdomain: string | null) => {
  try {
    if (isNonEmptyString(subdomain)) {
      window.localStorage.setItem(
        SELECTED_WORKSPACE_SUBDOMAIN_STORAGE_KEY,
        subdomain,
      );
    } else {
      window.localStorage.removeItem(SELECTED_WORKSPACE_SUBDOMAIN_STORAGE_KEY);
    }
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the
    // selection then only lives in the URL for this page load.
  }
};
