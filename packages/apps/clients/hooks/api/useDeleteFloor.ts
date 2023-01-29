import { api } from '@wimet/apps-shared';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { GET_CLIENT_LOCATION } from './useGetClientLocation';

export const deleteFloor = async (floorId: string) => {
  try {
    await api.delete(`/floors/${floorId}`);
  } catch (e) {
    toast.error((e as Error).message);
  }
};

const useDeleteFloor = (locationId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation(deleteFloor, {
    onSuccess: () => {
      queryClient.invalidateQueries([GET_CLIENT_LOCATION, locationId]);
      toast.success('El piso fue borrado con éxito');
    },
  });
};

export default useDeleteFloor;
