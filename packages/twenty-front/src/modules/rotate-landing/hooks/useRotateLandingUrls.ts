import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { AppPath } from 'twenty-shared/types';

export const useRotateLandingUrls = () => {
  const { frontDomain, defaultSubdomain } = useAtomStateValue(
    domainConfigurationState,
  );

  const defaultDomainOrigin = `${window.location.protocol}//${defaultSubdomain ?? 'app'}.${frontDomain}`;

  return {
    signInUrl: `${defaultDomainOrigin}${AppPath.SignInUp}`,
    workspaceUrl: (subdomain: string) =>
      `${window.location.protocol}//${subdomain}.${frontDomain}`,
  };
};
