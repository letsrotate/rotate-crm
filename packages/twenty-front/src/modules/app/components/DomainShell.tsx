import { BrowserRouter } from 'react-router-dom';

import { RootApp } from '@/app/components/RootApp';
import { SharedAppProviders } from '@/app/components/SharedAppProviders';
import { WorkspaceApp } from '@/app/components/WorkspaceApp';
import { isOnOnboardingTransitionPath } from '@/auth/utils/isOnOnboardingTransitionPath';
import { clientConfigApiStatusState } from '@/client-config/states/clientConfigApiStatusState';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { useIsCurrentLocationOnDefaultDomain } from '@/domain-manager/hooks/useIsCurrentLocationOnDefaultDomain';
import { OnboardingPageLoader } from '@/onboarding/components/OnboardingPageLoader';
import { RotateLandingPage } from '@/rotate-landing/components/RotateLandingPage';
import { useIsCurrentLocationOnLandingDomain } from '@/rotate-landing/hooks/useIsCurrentLocationOnLandingDomain';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { UserOrMetadataLoader } from '~/loading/components/UserOrMetadataLoader';

export const DomainShell = () => {
  const { isLoadedOnce } = useAtomStateValue(clientConfigApiStatusState);
  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );
  const { isDefaultDomain } = useIsCurrentLocationOnDefaultDomain();
  const { isLandingDomain } = useIsCurrentLocationOnLandingDomain();

  if (!isLoadedOnce) {
    return (
      <BrowserRouter>
        <SharedAppProviders>
          {isOnOnboardingTransitionPath(window.location.pathname) ? (
            <OnboardingPageLoader />
          ) : (
            <UserOrMetadataLoader />
          )}
        </SharedAppProviders>
      </BrowserRouter>
    );
  }

  if (!isMultiWorkspaceEnabled) {
    return <WorkspaceApp />;
  }

  // Rotate fork: the bare apex serves the marketing/landing page; sign-in
  // stays on the default subdomain and tenants on their own subdomains.
  if (isLandingDomain) {
    return <RotateLandingPage />;
  }

  return isDefaultDomain ? <RootApp /> : <WorkspaceApp />;
};
