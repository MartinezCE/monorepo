import { UserRoleEnum } from '../common/enum/user';
import UserRole from '../db/models/UserRole';

export default class UserRoleService {
  static async getOneByName(value: UserRoleEnum) {
    return UserRole.findOne({
      where: {
        value,
      },
      rejectOnEmpty: true,
    });
  }
}
