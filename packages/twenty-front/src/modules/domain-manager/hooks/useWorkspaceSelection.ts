import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { isWorkspaceSubdomainRoutingEnabledState } from '@/client-config/states/isWorkspaceSubdomainRoutingEnabledState';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { readSelectedWorkspaceSubdomain } from '@/domain-manager/utils/readSelectedWorkspaceSubdomain';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isNonEmptyString } from '@sniptt/guards';
import { useMemo } from 'react';

// Rotate fork: "single host" mode keeps Twenty's multi-workspace model but
// serves every workspace from the front URL. The server still resolves the
// workspace from an origin, so the front sends a virtual
// `<subdomain>.<frontDomain>` origin for the selected workspace and only
// translates it back to a real URL when it navigates.
export const useWorkspaceSelection = () => {
  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );
  const isWorkspaceSubdomainRoutingEnabled = useAtomStateValue(
    isWorkspaceSubdomainRoutingEnabledState,
  );
  const { frontDomain, defaultSubdomain } = useAtomStateValue(
    domainConfigurationState,
  );

  const isSingleHostMode =
    isMultiWorkspaceEnabled && !isWorkspaceSubdomainRoutingEnabled;

  const selectedWorkspaceSubdomain = useMemo(
    () => (isSingleHostMode ? readSelectedWorkspaceSubdomain() : null),
    [isSingleHostMode],
  );

  const virtualHostname = `${selectedWorkspaceSubdomain ?? defaultSubdomain}.${frontDomain}`;

  const { protocol, port } = window.location;
  const virtualOrigin = `${protocol}//${virtualHostname}${isNonEmptyString(port) ? `:${port}` : ''}`;

  const getSubdomainFromVirtualUrl = (url: string): string | undefined => {
    const { hostname } = new URL(url);
    const frontDomainSuffix = `.${frontDomain}`;

    return isNonEmptyString(frontDomain) && hostname.endsWith(frontDomainSuffix)
      ? hostname.slice(0, -frontDomainSuffix.length)
      : undefined;
  };

  return {
    isSingleHostMode,
    selectedWorkspaceSubdomain,
    virtualHostname,
    virtualOrigin,
    getSubdomainFromVirtualUrl,
  };
};
