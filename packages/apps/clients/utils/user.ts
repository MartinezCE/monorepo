import { CompanyWPMUser, User } from '@wimet/apps-shared';

export const handleUserSearch = (us: User | CompanyWPMUser, searchValue: string) =>
  `${us.firstName}${us.email}`.toLowerCase().includes(searchValue.toLocaleLowerCase());
