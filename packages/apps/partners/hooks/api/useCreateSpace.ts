import { api, AxiosError } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions } from 'react-query';
import { toast } from 'react-toastify';

type CreateSpacesPayload = {
  locationId: string;
  peopleCapacity: string;
  area: string;
  spaceTypeId: number;
  spaceReservationTypeId: number;
  name: string;
};

type Props = UseMutationOptions<unknown, unknown, CreateSpacesPayload>;

const createSpaces = async (payload: CreateSpacesPayload) => {
  const { locationId, ...restPayload } = payload;
  const { data: space } = await api.post(`locations/${locationId}/spaces`, restPayload);
  return space;
};

const useCreateSpaces = ({ ...queryOptions }: Props) =>
  useMutation(createSpaces, {
    onError: error => {
      toast.error((error as AxiosError)?.message || 'There was an error.');
    },
    ...queryOptions,
  });

export default useCreateSpaces;
