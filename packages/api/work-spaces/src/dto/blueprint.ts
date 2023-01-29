import { BlueprintInput } from '../db/models/Blueprint';

export interface BlueprintDTO extends BlueprintInput {}

export interface UserBlueprintDTO {
  blueprints: {
    id: number;
    amenityIds: number[];
  }[];
}
