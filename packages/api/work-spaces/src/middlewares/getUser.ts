import User from '../db/models/User';
import UserType from '../db/models/UserType';
import UserService from '../services/user';

const getUser = async (req: Express.Request) => {
  let user: User;

  if (req.user?.fromMiddleware) {
    user = req.user as User;
  } else {
    user = await UserService.getUserById(req.user.id, undefined, { include: [UserType] });
  }

  req.user = user;
  req.user.fromMiddleware = true;
  return user;
};

export default getUser;
