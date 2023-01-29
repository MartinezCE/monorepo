import { DeleteBaseModal } from '@wimet/apps-shared';
import useDeleteWPMUserPermissions from '../../../hooks/api/useDeleteWPMUserPermissions';

type Props = {
  userId: number;
  onCancel: () => void;
  onClose: () => void;
};

export default function UsersTable({ userId, onCancel, onClose }: Props) {
  const { mutateAsync: deleteUserPermissions, isLoading: isDeletingUserPermissions } = useDeleteWPMUserPermissions();

  return (
    <DeleteBaseModal
      title='¿Eliminar todos los permisos del usuario?'
      text='Al hacer esto se le eliminarán todos los accesos a planos y amenities que le haya otorgado. También se le eliminará el acceso a Workplace Manager.'
      disableButton={isDeletingUserPermissions}
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={() => deleteUserPermissions(userId)}
    />
  );
}
