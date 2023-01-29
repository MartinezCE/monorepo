import { CompanyInput } from '../db/models/Company';
import { UserInput } from '../db/models/User';

export interface SignUpDTO extends UserInput {
  token?: string;
  company?: CompanyInput;
}
