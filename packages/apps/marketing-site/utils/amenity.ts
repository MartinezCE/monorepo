import { Space } from '@wimet/apps-shared';

export const groupAmenitiesFromSpace = (space: Partial<Space>) => [
  ...(space.location?.locationsAmenities.LOCATION || []),
  ...(space.spacesAmenities?.SPACE || []),
  ...(space.location?.locationsAmenities.CUSTOM || []),
  ...(space.spacesAmenities?.CUSTOM || []),
];
