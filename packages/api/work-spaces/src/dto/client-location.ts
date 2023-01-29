import { LocationInput } from '../db/models/Location';
import { FloorDTO } from './floor';

export interface ClientLocationDTO extends LocationInput {
  floors?: FloorDTO[];
}
