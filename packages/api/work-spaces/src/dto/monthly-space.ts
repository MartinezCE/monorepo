import { MonthlySpaceInput } from '../db/models/MonthlySpace';
import { SpaceDiscountInput } from '../db/models/SpaceDiscount';
import SpaceDiscountMonthlySpace from '../db/models/SpaceDiscountMonthlySpace';

export interface MonthlyDTO extends MonthlySpaceInput {
  spaceDepositId?: number;
  spaceDiscounts: (SpaceDiscountInput & SpaceDiscountMonthlySpace)[];
}
