import { api } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { GET_COLLABORATORS } from './useGetCollaborators';

type DeleteCollaboratorPayload = string | number;

export const deleteCollaborator = async (companyId: number | string, collaboratorId: DeleteCollaboratorPayload) => {
  await api.delete(`/companies/${companyId}/collaborators/${collaboratorId}`);
};

const useDeleteCollaborator = (
  companyId: number | string,
  options?: UseMutationOptions<unknown, unknown, DeleteCollaboratorPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation(collaboratorId => deleteCollaborator(companyId, collaboratorId), {
    onSuccess: () => queryClient.invalidateQueries([GET_COLLABORATORS]),
    ...options,
  });
};

export default useDeleteCollaborator;
