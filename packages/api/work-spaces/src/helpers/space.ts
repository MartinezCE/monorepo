import { isUndefined, omitBy } from 'lodash';
import Space from '../db/models/Space';

export type SpaceFilters = {
  spaceTypeId: Space['spaceTypeId'] | Space['spaceTypeId'][];
  status: Space['status'];
  spaceReservationTypeId: Space['spaceReservationTypeId'];
};

export default class SpaceHelper {
  static getCleanFilters({ spaceTypeId, status, spaceReservationTypeId }: Record<string, unknown>) {
    const getSpaceTypeId = () => {
      if (isUndefined(spaceTypeId)) return undefined;
      if (Array.isArray(spaceTypeId)) return spaceTypeId;
      return Number(spaceTypeId);
    };
    const filters = omitBy(
      {
        status: status as Space['status'],
        spaceTypeId: getSpaceTypeId(),
        spaceReservationTypeId: spaceReservationTypeId ? Number(spaceReservationTypeId) : undefined,
      },
      isUndefined
    );

    return (filters || {}) as SpaceFilters;
  }
}
