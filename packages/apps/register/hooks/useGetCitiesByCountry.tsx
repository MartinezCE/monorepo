import { useEffect, useMemo } from 'react';
import { useGetCountries } from '@wimet/apps-shared';

type ParsedStates = {
  label: string;
  value: number;
  countryId: number;
  createdAt: string;
  updatedAt: string;
};

type ParsedCompany = {
  label: string;
  value: number;
  states: {
    label: string;
    value: number;
    countryId: number;
    createdAt: string;
    updatedAt: string;
  }[];
  iso3?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

const useGetCitiesByCountry = ({
  countryId,
  onCitiesChange,
}: {
  countryId: number;
  onCitiesChange: (selectedCountry: ParsedCompany, cities: ParsedStates[]) => void;
}) => {
  const { data: countries = [] } = useGetCountries({
    select: dataCountries =>
      dataCountries.map(({ name, id, states, ...country }) => ({
        ...country,
        label: name,
        value: id,
        states: states?.map(({ name: stateName, id: stateId, ...state }) => ({
          ...state,
          label: stateName,
          value: stateId,
        })),
      })),
  });

  const selectedCountry = useMemo(
    () => (countries.find(c => c.value === countryId) || { states: [] }) as typeof countries[number],
    [countries, countryId]
  );

  useEffect(() => onCitiesChange?.(selectedCountry, selectedCountry.states), [selectedCountry]); // eslint-disable-line react-hooks/exhaustive-deps

  return { countries, selectedCountry };
};

export default useGetCitiesByCountry;
