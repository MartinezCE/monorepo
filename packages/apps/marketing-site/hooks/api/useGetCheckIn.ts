import { api } from '@wimet/apps-shared';
import { useQuery } from 'react-query';
import { ReservationCheckIn } from '../../interfaces/api';

export const GET_CHECKIN = 'GET_CHECKIN';

export const getCheckIn = async (locale: string) => {
  const { data } = await api.get(`checkin/users/${locale}/checkin`);

  return data;
};

const useGetCheckIn = (locale: string) =>
  useQuery<ReservationCheckIn[]>([GET_CHECKIN, locale], () => getCheckIn(locale));

export default useGetCheckIn;
