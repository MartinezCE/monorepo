import { PlanInput } from '../db/models/Plan';

export interface PlanDTO extends Omit<PlanInput, 'startDate'> {
  users: number[];
  startDate: Date;
  credits?: number;
}
