import UserAmenity from '../db/models/UserAmenity';

export default class UserAmenityService {
  static async deleteByUser(userId: number) {
    return UserAmenity.destroy({ where: { userId } });
  }
}
