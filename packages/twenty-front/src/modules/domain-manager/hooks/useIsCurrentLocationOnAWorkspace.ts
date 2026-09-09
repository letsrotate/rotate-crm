import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { useReadDefaultDomainFromConfiguration } from '@/domain-manager/hooks/useReadDefaultDomainFromConfiguration';
import { useWorkspaceSelection } from '@/domain-manager/hooks/useWorkspaceSelection';
import { domainConfigurationState } from '@/domain-manager/states/domainConfigurationState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isDefined } from 'twenty-shared/utils';

export const useIsCurrentLocationOnAWorkspace = () => {
  const { defaultDomain } = useReadDefaultDomainFromConfiguration();

  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );
  const domainConfiguration = useAtomStateValue(domainConfigurationState);
  const { isSingleHostMode, selectedWorkspaceSubdomain } =
    useWorkspaceSelection();

  if (
    isMultiWorkspaceEnabled &&
    (!isDefined(domainConfiguration.frontDomain) ||
      !isDefined(domainConfiguration.defaultSubdomain))
  ) {
    throw new Error('frontDomain and defaultSubdomain are required');
  }

  if (isSingleHostMode) {
    return { isOnAWorkspace: isDefined(selectedWorkspaceSubdomain) };
  }

  const isOnAWorkspace = !isMultiWorkspaceEnabled
    ? true
    : window.location.hostname !== defaultDomain;

  return {
    isOnAWorkspace,
  };
};
