import Blueprint from '../db/models/Blueprint';
import Company from '../db/models/Company';
import Floor from '../db/models/Floor';
import Seat from '../db/models/Seat';
import User from '../db/models/User';
import Location from '../db/models/Location';
import UserRole from '../db/models/UserRole';
import WPMReservation from '../db/models/WPMReservation';
import CompanyService from './company';
import Space from '../db/models/Space';
import SpaceType from '../db/models/SpaceType';

export default class CollaboratorService {
  static async findCollaboratorByUserId(userId: number, companyId: number, collaboratorId: number) {
    const company = await CompanyService.findCompanyByUserId(userId, companyId);
    const collaborator = await User.findOne({
      where: {
        id: collaboratorId,
      },
      include: [
        {
          model: Company,
          where: {
            id: company.id,
          },
        },
        {
          model: Blueprint,
        },
        {
          model: UserRole,
        },
        {
          model: WPMReservation,
          include: [
            {
              model: Seat,
              include: [
                {
                  model: Blueprint,
                  include: [
                    {
                      model: Floor,
                      include: [
                        {
                          model: Location,
                          include: [
                            {
                              model: Space,
                              include: [
                                {
                                  model: SpaceType,
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return collaborator;
  }
}
