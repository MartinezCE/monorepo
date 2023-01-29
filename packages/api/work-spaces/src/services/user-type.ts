import UserType from '../db/models/UserType';
import { UserTypeEnum } from '../common/enum/user';

export default class UserTypeService {
  static async getOneByName(value: UserTypeEnum) {
    return UserType.findOne({
      where: {
        value,
      },
      rejectOnEmpty: true,
    });
  }
}
