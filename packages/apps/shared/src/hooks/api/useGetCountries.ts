import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '../../api';

export type Countries = {
  id: number;
  name: string;
  iso3?: string;
  states: {
    id: number;
    countryId: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}[];

export const GET_COUNTRIES = 'GET_COUNTRIES';

export const getCountries = async () => {
  const countries: Countries = await api.get('/countries').then(r => r.data);
  return countries;
};

export const useGetCountries = <T = Countries>(
  options?: UseQueryOptions<Countries, unknown, T, typeof GET_COUNTRIES>
) => useQuery(GET_COUNTRIES, getCountries, { ...options });
