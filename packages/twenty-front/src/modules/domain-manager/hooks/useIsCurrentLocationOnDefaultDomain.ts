import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useReadDefaultDomainFromConfiguration } from '@/domain-manager/hooks/useReadDefaultDomainFromConfiguration';
import { useWorkspaceSelection } from '@/domain-manager/hooks/useWorkspaceSelection';
import { isDefined } from 'twenty-shared/utils';

export const useIsCurrentLocationOnDefaultDomain = () => {
  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );
  const { defaultDomain } = useReadDefaultDomainFromConfiguration();
  const { isSingleHostMode, selectedWorkspaceSubdomain } =
    useWorkspaceSelection();

  if (isSingleHostMode) {
    return { isDefaultDomain: !isDefined(selectedWorkspaceSubdomain) };
  }

  const isDefaultDomain = isMultiWorkspaceEnabled
    ? window.location.hostname === defaultDomain
    : true;

  return {
    isDefaultDomain,
  };
};
