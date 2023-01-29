import { api, Hourly, Space, SpaceSchedule } from '@wimet/apps-shared';
import { useMutation, UseMutationOptions } from 'react-query';

type UpdateSpacePayload = {
  peopleCapacity?: string;
  area?: string;
  spaceTypeId?: number;
  spaceReservationTypeId?: number;
  name?: string;
  spaceOfferId: number;
  tourUrl: string | null;
  amenities?: (number | undefined)[];
  schedule?: SpaceSchedule[];
  hourly?: Hourly[];
  monthly?: {
    spaceDiscounts?: {
      percentage: number;
      spaceDiscountId?: number;
    }[];
    price?: number | null;
    minMonthsAmount?: number | null;
    maxMonthsAmount?: number | null;
    spaceDepositId?: number | null;
  };
};

const updateSpace = async (spaceId: number, payload: UpdateSpacePayload) => {
  const { data: space } = await api.patch(`/spaces/${spaceId}`, payload);
  return space;
};

const useUpdateSpace = (
  spaceId: number,
  options?: UseMutationOptions<Space | Partial<Space>, unknown, UpdateSpacePayload>
) => useMutation(payload => updateSpace(spaceId, payload), options);

export default useUpdateSpace;
