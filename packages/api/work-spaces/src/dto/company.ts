import { CompanyInput } from '../db/models/Company';

export interface CompanyDTO extends CompanyInput {
  country: number;
}
