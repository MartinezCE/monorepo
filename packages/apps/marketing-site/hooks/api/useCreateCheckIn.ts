import { useMutation, useQueryClient } from 'react-query';
import { api } from '@wimet/apps-shared';
import { GET_CHECKIN } from './useGetCheckIn';

export const createCheckIn = async (id: string) => {
  const { data: amenity } = await api.post(`checkin/${id}/confirm`);
  return amenity;
};

const useCreateCheckIn = (location: string) => {
  const quereClient = useQueryClient();
  return useMutation(createCheckIn, {
    onSuccess: () => {
      quereClient.invalidateQueries([GET_CHECKIN, location]);
    },
  });
};
export default useCreateCheckIn;
