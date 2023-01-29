import { HourlySpaceInput } from '../db/models/HourlySpace';
import { SpaceInput } from '../db/models/Space';
import { SpaceFileInput } from '../db/models/SpaceFile';
import { SpaceScheduleInput } from '../db/models/SpaceSchedule';
import { MonthlyDTO } from './monthly-space';

export interface SpaceDTO extends SpaceInput {
  spaceTypeId?: number;
  spaceFiles?: SpaceFileInput[];
  amenities?: number[];
  spaceReservationTypeId?: number;
  monthly?: MonthlyDTO;
  hourly?: HourlySpaceInput[];
  schedule: SpaceScheduleInput[];
}
