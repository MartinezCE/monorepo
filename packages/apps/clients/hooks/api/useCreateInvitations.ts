import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import { api } from '@wimet/apps-shared';
import { ClientInvitation } from '../../types/api';
import { GET_COLLABORATORS } from './useGetCollaborators';

export type CreateInvitationPayload = {
  companyId?: number;
  emails: { email?: string; firstName?: string; lastName?: string }[];
};

export const createInvitations = async (payload: CreateInvitationPayload) => {
  const { data: invitations } = await api.post('/clients-invitation', payload);
  return invitations as ClientInvitation;
};

const useCreateInvitations = (
  options?: UseMutationOptions<ClientInvitation | Partial<ClientInvitation>, unknown, CreateInvitationPayload>
) => {
  const queryClient = useQueryClient();

  return useMutation(createInvitations, {
    onSuccess: async () => {
      await queryClient.invalidateQueries([GET_COLLABORATORS]);
    },
    ...options,
  });
};

export default useCreateInvitations;
