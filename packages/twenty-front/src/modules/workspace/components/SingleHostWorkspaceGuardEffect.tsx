import { useAuth } from '@/auth/hooks/useAuth';
import { availableWorkspacesState } from '@/auth/states/availableWorkspacesState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useGetPublicWorkspaceDataByDomain } from '@/domain-manager/hooks/useGetPublicWorkspaceDataByDomain';
import { useRedirectToWorkspaceDomain } from '@/domain-manager/hooks/useRedirectToWorkspaceDomain';
import { useWorkspaceSelection } from '@/domain-manager/hooks/useWorkspaceSelection';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useEffect, useState } from 'react';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { getWorkspaceUrl } from '~/utils/getWorkspaceUrl';

// Rotate fork, single-host mode only. Every workspace shares one session
// cookie, so opening `?w=<other workspace>` would otherwise keep the session
// (and data) of the workspace the user last signed into. When the selected
// workspace and the session's workspace differ, switch sessions through the
// login token the server hands out for every workspace the user belongs to,
// and sign out when there is none (the sign-in page then targets the selected
// workspace).
export const SingleHostWorkspaceGuardEffect = () => {
  const { isSingleHostMode } = useWorkspaceSelection();
  const { data: publicWorkspaceData } = useGetPublicWorkspaceDataByDomain();
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const availableWorkspaces = useAtomStateValue(availableWorkspacesState);
  const { redirectToWorkspaceDomain } = useRedirectToWorkspaceDomain();
  const { signOut } = useAuth();
  const [hasHandledMismatch, setHasHandledMismatch] = useState(false);

  // The current workspace is restored from local storage before the user
  // query answers; an empty sign-in list means that answer is still pending.
  const isCurrentUserLoaded =
    availableWorkspaces.availableWorkspacesForSignIn.length > 0;

  useEffect(() => {
    if (
      !isSingleHostMode ||
      hasHandledMismatch ||
      !isCurrentUserLoaded ||
      !isDefined(publicWorkspaceData) ||
      !isDefined(currentWorkspace) ||
      publicWorkspaceData.id === currentWorkspace.id
    ) {
      return;
    }

    setHasHandledMismatch(true);

    const selectedWorkspace =
      availableWorkspaces.availableWorkspacesForSignIn.find(
        ({ id }) => id === publicWorkspaceData.id,
      );

    if (isDefined(selectedWorkspace?.loginToken)) {
      redirectToWorkspaceDomain(
        getWorkspaceUrl(selectedWorkspace.workspaceUrls),
        AppPath.Verify,
        { loginToken: selectedWorkspace.loginToken },
      );

      return;
    }

    signOut();
  }, [
    isSingleHostMode,
    hasHandledMismatch,
    isCurrentUserLoaded,
    publicWorkspaceData,
    currentWorkspace,
    availableWorkspaces,
    redirectToWorkspaceDomain,
    signOut,
  ]);

  return <></>;
};
