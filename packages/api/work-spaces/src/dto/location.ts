import { LocationInput } from '../db/models/Location';
import { LocationFileInput } from '../db/models/LocationFile';

export interface LocationDTO extends LocationInput {
  locationFiles?: LocationFileInput[];
  amenities?: number[];
  spaces?: { spaceTypeId: number; count: number; name: string }[];
}
