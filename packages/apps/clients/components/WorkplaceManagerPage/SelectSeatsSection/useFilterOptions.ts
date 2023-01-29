import { LocationStatus, SpaceTypeEnum } from '@wimet/apps-shared';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import useGetAllClientLocations from '../../../hooks/api/useGetAllClientLocations';

type Props = {
  fetchAllLocations?: boolean;
  fetchOnlyPublished?: boolean;
};

const useFilterOptions = ({ fetchAllLocations, fetchOnlyPublished = false }: Props = { fetchAllLocations: false }) => {
  const router = useRouter();
  const { locationId, floorId, blueprintId } = router.query as { [k: string]: string };

  const { data: clientsLocation = [] } = useGetAllClientLocations(
    fetchOnlyPublished
      ? {
          status: LocationStatus.PUBLISHED,
          floorsRequired: true,
        }
      : {},
    { staleTime: 0, enabled: fetchAllLocations }
  );

  const locationOptions = useMemo(
    () =>
      clientsLocation.map(location => ({
        ...location,
        value: Number(location.id),
        label: String(location.name),
      })),
    [clientsLocation]
  );

  const currentLocation = useMemo(
    () => locationOptions.find(location => location.value?.toString() === locationId) || locationOptions[0],
    [locationOptions, locationId]
  );

  const floorOptions = useMemo(
    () =>
      (currentLocation?.floors || [])
        .filter(floor => !!floor.number && (floor.blueprints || []).length > 0 && floor.blueprints.some(b => !!b.name))
        .map(floor => ({
          ...floor,
          value: floor.id,
          label: `Piso ${floor.number}`,
        })),
    [currentLocation?.floors]
  );

  const currentFloor = useMemo(
    () => (floorOptions || []).find(floor => floor.value.toString() === floorId) || floorOptions[0],
    [floorOptions, floorId]
  );

  const blueprintOptions = useMemo(
    () =>
      (currentFloor?.blueprints || [])
        .filter(blueprint => !!blueprint.name)
        .map(blueprint => ({
          ...blueprint,
          value: blueprint.id,
          label: blueprint.name,
        })),
    [currentFloor]
  );

  const currentBlueprint = useMemo(
    () => (blueprintOptions || []).find(blueprint => blueprint.value.toString() === blueprintId) || blueprintOptions[0],
    [blueprintOptions, blueprintId]
  );

  const handleFilters = (e: { value: string }, name: string) => {
    router.push(
      {
        // @ts-ignore
        path: router.asPath,
        query: {
          ...router.query,
          [name]: e.value,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  return {
    locationOptions,
    currentLocation,
    floorOptions,
    currentFloor,
    blueprintOptions,
    currentBlueprint,
    filterMarkersBy: (router.query?.filterMarkersBy as SpaceTypeEnum) || null,
    filterByDate: router.query?.date as unknown as Date,
    handleFilters,
  };
};

export default useFilterOptions;
