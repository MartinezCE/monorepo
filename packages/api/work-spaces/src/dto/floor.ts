import { FloorInput } from '../db/models/Floor';
import { BlueprintDTO } from './blueprint';

export interface FloorDTO extends FloorInput {
  blueprints?: BlueprintDTO[];
}
