import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { AppPath } from 'twenty-shared/types';

// frontDomain carries no port (it is "localhost" in dev), so the current
// port is re-applied; in production there is none.
export const useRotateLandingUrls = () => {
  const { frontDomain, defaultSubdomain } = useAtomStateValue(
    domainConfigurationState,
  );

  const { protocol, port } = window.location;
  const portSuffix = port.length > 0 ? `:${port}` : '';

  const originForSubdomain = (subdomain: string) =>
    `${protocol}//${subdomain}.${frontDomain}${portSuffix}`;

  return {
    signInUrl: `${originForSubdomain(defaultSubdomain ?? 'app')}${AppPath.SignInUp}`,
    workspaceUrl: originForSubdomain,
  };
};
