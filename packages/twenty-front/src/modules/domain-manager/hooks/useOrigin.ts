import { useWorkspaceSelection } from '@/domain-manager/hooks/useWorkspaceSelection';
import { useMemo } from 'react';

export const useOrigin = () => {
  const { isSingleHostMode, virtualOrigin } = useWorkspaceSelection();

  const origin = useMemo(
    () => (isSingleHostMode ? virtualOrigin : window.location.origin),
    [isSingleHostMode, virtualOrigin],
  );

  return { origin };
};
