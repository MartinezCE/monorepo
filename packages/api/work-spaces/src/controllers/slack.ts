import { Request, Response } from 'express';
import SlackService from '../services/slack';
import UserService from '../services/user';

export default class SlackController {
  static async ping(_: Request, res: Response) {
    await SlackService.ping();
    res.send('Pong!');
  }

  static async aprovedClient(req: Request, res: Response) {
    const { userId } = req.params;
    await UserService.availableCompany(userId);
    res.send('Aprobado');
  }

  static async aprovedClientWPM(req: Request, res: Response) {
    const { userId } = req.params;
    await UserService.availableWPM(userId);
    res.send('Aprobado WPM');
  }
}
