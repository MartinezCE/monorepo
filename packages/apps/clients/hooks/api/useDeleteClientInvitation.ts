import { api } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { GET_COLLABORATORS } from './useGetCollaborators';

type DeleteClientInvitationPayload = string | number;

export const deleteClientInvitation = async (invitationId: DeleteClientInvitationPayload) => {
  await api.delete(`/clients-invitation/${invitationId}`);
};

const useDeleteClientInvitation = (options?: UseMutationOptions<unknown, unknown, DeleteClientInvitationPayload>) => {
  const queryClient = useQueryClient();

  return useMutation(invitationId => deleteClientInvitation(invitationId), {
    onSuccess: () => queryClient.invalidateQueries([GET_COLLABORATORS]),
    ...options,
  });
};

export default useDeleteClientInvitation;
