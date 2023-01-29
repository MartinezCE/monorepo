import { Collaborator, DeleteBaseModal, useGetMe } from '@wimet/apps-shared';
import useDeleteClientInvitation from '../../hooks/api/useDeleteClientInvitation';
import useDeleteCollaborator from '../../hooks/api/useDeleteCollaborator';

type Props = {
  selectedCollaborator?: Collaborator;
  onClose: () => void;
  onCancel: () => void;
};

const DeleteCollaboratorModal = ({ selectedCollaborator, onClose, onCancel }: Props) => {
  const { data: userData } = useGetMe();
  const companyId = Number(userData?.companies[0].id);

  const { mutateAsync: deleteCollaborator, isLoading: isDeletingCollaborator } = useDeleteCollaborator(companyId);
  const { mutateAsync: deleteClientInvitation, isLoading: isDeletingClientInvitation } = useDeleteClientInvitation();

  const handleOnConfirm = async () => {
    if (!selectedCollaborator) return;
    if (selectedCollaborator.isRegistered) await deleteCollaborator(selectedCollaborator.id);
    else await deleteClientInvitation(selectedCollaborator.id);
    onClose();
  };

  return (
    <DeleteBaseModal
      title={`¿Borrar ${selectedCollaborator?.isRegistered ? 'colaborador' : 'invitación'} de la empresa?`}
      onClose={onClose}
      onCancel={onCancel}
      onConfirm={handleOnConfirm}
      disableButton={isDeletingCollaborator || isDeletingClientInvitation}
    />
  );
};

export default DeleteCollaboratorModal;
