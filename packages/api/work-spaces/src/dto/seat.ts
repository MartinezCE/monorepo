import { SeatInput } from '../db/models/Seat';

export interface SeatDTO extends SeatInput {
  amenities?: number[];
}
