import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { useWorkspaceSelection } from '@/domain-manager/hooks/useWorkspaceSelection';

export const useReadWorkspaceUrlFromCurrentLocation = () => {
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();
  const { isSingleHostMode, virtualHostname } = useWorkspaceSelection();

  if (!isOnAWorkspace) {
    return { currentLocationHostname: undefined };
  }

  return {
    currentLocationHostname: isSingleHostMode
      ? virtualHostname
      : window.location.hostname,
  };
};
