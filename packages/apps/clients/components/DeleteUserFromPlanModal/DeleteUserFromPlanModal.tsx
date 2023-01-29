import { Collaborator, DeleteBaseModal } from '@wimet/apps-shared';
import { useRouter } from 'next/router';
import useDeletePlanUser from '../../hooks/api/useDeletePlanUser';

type Props = {
  selectedCollaborator?: Collaborator;
  onClose: () => void;
  onCancel: () => void;
};

const DeleteUserFromPlanModal = ({ selectedCollaborator, onClose, onCancel }: Props) => {
  const router = useRouter();
  const { planId } = router.query;

  const { mutateAsync, isLoading } = useDeletePlanUser();

  const handleOnConfirm = async () => {
    if (!selectedCollaborator) return;
    await mutateAsync({ planId: Number(planId), userId: selectedCollaborator.id });
    onClose();
  };

  return (
    <DeleteBaseModal
      title='¿Remover colaborador de este plan?'
      onClose={onClose}
      onCancel={onCancel}
      onConfirm={handleOnConfirm}
      disableButton={isLoading}
    />
  );
};

export default DeleteUserFromPlanModal;
