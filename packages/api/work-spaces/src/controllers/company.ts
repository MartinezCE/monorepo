import { addMonths, endOfDay, subDays } from 'date-fns';
import { NextFunction, Request, Response } from 'express';
import { s3 } from '@wimet/api-shared';
import createHttpError from 'http-errors';
import CompanyType from '../db/models/CompanyType';
import { LocationDTO } from '../dto/location';
import FileService from '../services/file';
import LocationService from '../services/location';
import ClientLocationService from '../services/client-location';
import CompanyService from '../services/company';
import UserService from '../services/user';
import BlueprintService from '../services/blueprint';
import AmenityService from '../services/amenity';
import { S3File } from '../interfaces';
import CollaboratorService from '../services/collaborator';
import { BlueprintStatus } from '../db/models/Blueprint';
import PlanService, { InitialPlanRenovationsProps } from '../services/plan';
import { PlanDTO } from '../dto/plan';
import HourlySpaceReservationService from '../services/hourly-space-reservation';
import { TEAM_ALREADY_EXISTS, USER_CANNOT_DELETE_SELF } from '../config/errorCodes';
import { UserBlueprintDTO } from '../dto/blueprint';
import { UserAmenityDTO } from '../dto/amenities';
import { AmenityInput } from '../db/models/Amenity';
import logger from '../helpers/logger';
import Plan, { PlanStatus } from '../db/models/Plan';
import CreditsService from '../services/credits';
import PlanCredit from '../db/models/PlanCredit';
import { PlanTypes } from '../db/models/PlanType';
import DateService from '../helpers/date';
import State from '../db/models/State';
import TimezoneService from '../services/timezone';
import Credits from '../db/models/Credits';
import Currency from '../db/models/Currency';
import Country from '../db/models/Country';
import SlackService from '../services/slack';

const loggerInstance = logger('company-controller');

export default class CompanyController {
  static async createLocation(
    req: Request<{ companyId: number }, unknown, LocationDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await LocationService.setLocation(req.user.id, req.body, req.params.companyId);

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error creating the partner and company', error);
      next(error);
    }
  }

  static async createClientLocation(
    req: Request<{ companyId: number }, unknown, LocationDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user;

      const response = await ClientLocationService.setClientLocation(id, req.body, req.params.companyId);

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error creating the client and company', error);
      next(error);
    }
  }

  static async getCompanyTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CompanyType.findAll();

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error returning the company tyesp', error);
      next(error);
    }
  }

  static async updateCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;

      await CompanyService.setCompany(Number(companyId), req.body);

      res.sendStatus(204);
    } catch (error) {
      loggerInstance.error('There was an error updating company data', error);
      next(error);
    }
  }

  static async setCompanyAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      const { location, key } = req.file as S3File;

      const company = await CompanyService.findCompanyById(Number(companyId));

      if (company.avatarKey) {
        s3.deleteObject({ Bucket: process.env.AWS_LOCATIONS_BUCKET, Key: company.avatarKey });
      }

      await CompanyService.setCompanyAvatar(Number(companyId), location, key);

      res.sendStatus(204);
    } catch (error) {
      loggerInstance.error('There was an error updating company avatar', error);
      next(error);
    }
  }

  static async getAllLocations(
    req: Request<{ companyId: number }, unknown, LocationDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const location = await LocationService.findAllByUser(req.user.id, req.params.companyId);

      const data = location.map(l => {
        const parsedLocation = l.data.toJSON();

        return {
          ...parsedLocation,
          spaceCount: l.spaceCount,
          locationFiles: FileService.groupFileByType(l.data.locationFiles),
        };
      });

      res.send(data);
    } catch (error) {
      next(error);
    }
  }

  static async getCompany(req: Request<{ companyId: number }, unknown>, res: Response, next: NextFunction) {
    try {
      const company = await CompanyService.findCompanyById(req.params.companyId);

      res.send(company);
    } catch (error) {
      loggerInstance.error('There was an error getting the company', error);
      next(error);
    }
  }

  static async getCompanyCollaborators(
    req: Request<{ companyId: number }, unknown, unknown, { offset: number; limit: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { offset, limit } = req.query;
      const response = await CompanyService.getCompanyCollaborators(req.user.id, req.params.companyId, limit, offset);
      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error getting the company collaborators', error);
      next(error);
    }
  }

  static async getWPMUsers(
    req: Request<{ companyId: number }, unknown, unknown, { isWPMEnabled: boolean }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { isWPMEnabled } = req.query;

      const response = await UserService.getWPMUsers(req.user.id, req.params.companyId, isWPMEnabled);

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error getting the company users', error);
      next(error);
    }
  }

  static async switchUsersWPM(
    req: Request<{ companyId: number }, unknown, { isWPMEnabled: boolean; users: number[] }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { isWPMEnabled, users } = req.body;
      const response = await UserService.switchUsersWPM(req.user.id, req.params.companyId, users, isWPMEnabled);

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error enabling/disabling users WPM', error);
      next(error);
    }
  }

  static async getCompanyBlueprints(req: Request, res: Response, next: NextFunction) {
    const { status } = req.query;
    try {
      const blueprints = await BlueprintService.getAllByCompany(
        parseInt(req.params.companyId, 10),
        status as BlueprintStatus
      );
      res.send(blueprints);
    } catch (error) {
      loggerInstance.error('There was an error getting the company blueprints', error);
      next(error);
    }
  }

  static async setCompanyUserBlueprints(
    req: Request<{ companyId: number; userId: number }, unknown, UserBlueprintDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { blueprints } = req.body;
      const { companyId, userId } = req.params;

      const response = await UserService.setCompanyAllUsersBlueprints(req.user.id, companyId, blueprints, {
        where: { id: userId },
      });

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error setting the company user blueprints', error);
      next(error);
    }
  }

  static async setCompanyUsersBlueprints(
    req: Request<{ companyId: number }, unknown, UserBlueprintDTO, { teamId: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { blueprints } = req.body;
      const { companyId } = req.params;
      const { teamId } = req.query;

      let response: void;

      if (teamId) {
        response = await UserService.setCompanyTeamBlueprints(req.user.id, companyId, teamId, blueprints);
      } else {
        response = await UserService.setCompanyAllUsersBlueprints(req.user.id, companyId, blueprints, {
          where: { isWPMEnabled: true },
        });
      }

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error setting the company users blueprints', error);
      next(error);
    }
  }

  static async setCompanyUserAmenities(
    req: Request<{ companyId: number; userId: number }, unknown, UserAmenityDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { amenityIds } = req.body;
      const { companyId, userId } = req.params;

      const company = await CompanyService.findCompanyByUserId(userId, companyId, { rejectOnEmpty: true });
      const users = await UserService.getUserByCompany(company.id, userId, { rejectOnEmpty: true });
      const response = await UserService.setCompanyUsersAmenities(companyId, [users], amenityIds);

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error setting the company user blueprints', error);
      next(error);
    }
  }

  static async getSeatAmenities(
    req: Request<{ companyId: number }, unknown, unknown, { blueprintId?: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, req.params.companyId);
      const response = await AmenityService.findAllFromSeatsOfCompany(company.id, req.query.blueprintId);

      const amenities = AmenityService.getAmenitiesWithBlueprints(response);

      res.send(amenities);
    } catch (error) {
      loggerInstance.error('There was an error getting the company seat amenities', error);
      next(error);
    }
  }

  static async getCompanyCollaborator(
    req: Request<{ companyId: number; collaboratorId: number }, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await CollaboratorService.findCollaboratorByUserId(
        req.user.id,
        req.params.companyId,
        req.params.collaboratorId
      );
      res.send(user);
    } catch (error) {
      loggerInstance.error(
        `There was an error getting the collaboratorId ${req.params.collaboratorId} requested by userId ${req.user.id}`,
        error
      );
      next(error);
    }
  }

  static async createPlan(req: Request<{ companyId: number }, unknown, PlanDTO>, res: Response, next: NextFunction) {
    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, req.params.companyId, {
        rejectOnEmpty: true,
      });

      const plan = await PlanService.createPlan(company.id, req.body, req.user.id, req.timezone, company.tz);

      res.send(plan);
    } catch (error) {
      loggerInstance.error('There was an error creating the plan', error);
      next(error);
    }
  }

  static async getAllPlans(
    req: Request<{ companyId: number }, unknown, unknown, { offset: number; limit: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, req.params.companyId, {
        rejectOnEmpty: true,
      });
      const { offset, limit } = req.query;
      const response = await PlanService.getAllPlans(company.id, company.tz, limit, offset);

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error getting the company plans', error);
      next(error);
    }
  }

  static async getAllReservations(
    req: Request<{ companyId: number }, unknown, unknown, { offset: number; limit: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { offset, limit } = req.query;
    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, req.params.companyId, {
        rejectOnEmpty: true,
      });
      const response = await HourlySpaceReservationService.getReservationsByPartner(company.id, limit, offset);

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error getting the company reservations', error);
      next(error);
    }
  }

  static async getAllReservationsRevenue(
    req: Request<{ companyId: number }, unknown, unknown, { from: Date; to: Date }>,
    res: Response,
    next: NextFunction
  ) {
    const { from, to } = req.query;
    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, req.params.companyId, {
        rejectOnEmpty: true,
      });
      const response = await HourlySpaceReservationService.getAllBetweenByCompany(
        from,
        to,
        req.timezone,
        company.tz,
        company.id
      );

      console.log(response);

      const result = HourlySpaceReservationService.calculateSummaryUsedCredits(response);

      res.send(result);
    } catch (error) {
      loggerInstance.error('There was an error getting the company reservations', error);
      next(error);
    }
  }

  static async getAllReservationsClients(
    req: Request<{ companyId: number }, unknown, unknown, { from: Date; to: Date }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, req.params.companyId, {
        rejectOnEmpty: true,
      });
      const response = await HourlySpaceReservationService.getReservationsByCompany(company.id);
      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error getting the company reservations', error);
      next(error);
    }
  }

  static async removeUser(req, res) {
    try {
      const { companyId, userId } = req.params;

      // TODO: Move this to a middleware noSelfUserMiddleeware
      if (userId === req.user.id) throw createHttpError(400, USER_CANNOT_DELETE_SELF);

      const company = await CompanyService.findCompanyByUserId(req.user.id, companyId, {
        rejectOnEmpty: true,
      });

      await UserService.removeUserFromCompany(userId, company.id);

      res.send();
    } catch (error) {
      loggerInstance.error('There was an error removing the user', error);
    }
  }

  static async getAllUsers(
    req: Request<{ companyId: number }, unknown, unknown, { havePlans?: boolean }>,
    res: Response
  ) {
    try {
      const { havePlans } = req.query;

      const company = await CompanyService.findCompanyByUserId(req.user.id, req.params.companyId, {
        rejectOnEmpty: true,
      });
      const response = await UserService.getUsersByCompany(company.id, undefined, { havePlans });

      res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error getting the company users', error);
    }
  }

  static async deleteCompanyCollaborator(
    req: Request<{ companyId: number; collaboratorId: number }, unknown>,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.user;
    const { companyId, collaboratorId } = req.params;

    try {
      const user = await CollaboratorService.findCollaboratorByUserId(id, companyId, collaboratorId);
      await user.destroy();

      res.send();
    } catch (error) {
      loggerInstance.error(
        `There was an error deleting the collaboratorId ${collaboratorId} requested by userId ${id}`,
        error
      );
      next(error);
    }
  }

  static async getAmenities(req: Request<{ companyId: number }>, res: Response, next: NextFunction) {
    const { companyId } = req.params;

    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, companyId);
      const response = await AmenityService.findAllFromCompany(company.id);

      res.send(response);
    } catch (error) {
      loggerInstance.error(`There was an error getting the amenities of company ${companyId}`, error);
      next(error);
    }
  }

  static async createAmenity(
    req: Request<{ companyId: number }, unknown, { name: AmenityInput['name'] }>,
    res: Response,
    next: NextFunction
  ) {
    const { companyId } = req.params;
    const { name } = req.body;

    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, companyId);
      const [amenity] = await AmenityService.findOrCreateAmenity(name);
      await CompanyService.addCompanyAmenities(company.id, [amenity.id]);

      res.sendStatus(200);
    } catch (error) {
      loggerInstance.error(`There was an error creating the amenity of company ${companyId}`, error);
      next(error);
    }
  }

  static async deleteAmenity(
    req: Request<{ companyId: number; amenityId: number }, unknown>,
    res: Response,
    next: NextFunction
  ) {
    const { companyId, amenityId } = req.params;

    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, companyId);

      await CompanyService.removeAmenity(company.id, amenityId);

      res.sendStatus(200);
    } catch (error) {
      loggerInstance.error(`There was an error deleting the amenity ${amenityId} of company ${companyId}`, error);
      next(error);
    }
  }

  static async editAmenity(
    req: Request<{ companyId: number; amenityId: number }, unknown, { name: AmenityInput['name'] }>,
    res: Response,
    next: NextFunction
  ) {
    const { companyId, amenityId } = req.params;
    const { name } = req.body;

    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id, companyId, { rejectOnEmpty: true });
      const [amenity] = await AmenityService.findOrCreateAmenity(name);

      await CompanyService.replaceAmenity(company.id, amenityId, amenity.id);

      res.sendStatus(200);
    } catch (error) {
      loggerInstance.error(`There was an error editing the amenity ${amenityId} of company ${companyId}`, error);
      next(error);
    }
  }

  static async getTeams(req: Request<{ companyId: number }>, res: Response, next: NextFunction) {
    try {
      const plans = await Plan.scope({ method: ['byCompany', req.params.companyId] }).findAll({
        include: { model: PlanCredit, attributes: ['value'] },
      });
      const plansFullInfo = await Promise.all(
        plans.map(async p => {
          const users = (await UserService.getUsersByPlan(p.id, req.params.companyId)) || [];
          return { ...p.toJSON(), collaborators: users.length };
        })
      );

      res.send(plansFullInfo);
    } catch (error) {
      loggerInstance.error('There was an error getting the company teams', error);
      next(error);
    }
  }

  static async createTeam(req: Request<{ companyId: number }>, res: Response, next: NextFunction) {
    try {
      const plan = await Plan.scope({ method: ['byCompany', req.params.companyId] }).findOne({
        where: { name: req.body.name },
      });

      if (plan) throw createHttpError(409, TEAM_ALREADY_EXISTS);

      const DEFAULT_VALUES = {
        startDate: new Date().toISOString(),
        planTypeId: 7,
        maxPersonalCredits: 0,
        maxReservationCredits: 0,
        status: PlanStatus.ACTIVE,
      };

      const planCreated = await Plan.create({
        name: req.body.name,
        countryId: req.body.countryId,
        companyId: req.params.companyId,
        ...DEFAULT_VALUES,
      });

      res.send(planCreated);
    } catch (error) {
      loggerInstance.error('There was an error creating the company team', error);
      next(error);
    }
  }

  static async createTeamPlanCredits(
    req: Request<{ companyId: number; teamId: number }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { companyId, teamId } = req.params;

      const plan = await Plan.scope([{ method: ['byCompany', companyId] }]).findByPk(teamId);
      const { id: creditId } = await CreditsService.getByCompany(companyId);
      const planCredit = await PlanCredit.create({ planId: teamId, value: req.body.credits, creditId });

      const endCallback = (d: Date) => endOfDay(subDays(addMonths(d, 1), 1));

      const state = await State.scope({ method: ['byCountry', plan.countryId] }).findOne();
      const planCountryTz = await TimezoneService.getTimezone(state.name, state.country.name);

      const { startDate, endDate } = DateService.zonedStartEndDate(
        new Date().toISOString(),
        planCountryTz,
        planCountryTz,
        null,
        endCallback
      );

      const planRenovationPayload: InitialPlanRenovationsProps = {
        plan,
        startDate,
        endDate,
        originTz: planCountryTz,
        destinationTz: planCountryTz,
        planType: PlanTypes.CUSTOM,
        planCreditId: planCredit.id,
      };

      await PlanService.createInitialPlanRenovations(planRenovationPayload);

      const paymentType = req.body.paymentType === 'card' ? 'Tarjeta' : 'Transferencia bancaria';
      await SlackService.sendNewCompanyTeamCreditsAdded(plan, planCredit, companyId, paymentType);

      res.send(planCredit);
    } catch (error) {
      loggerInstance.error('There was an error creating the team plan credits', error);
      next(error);
    }
  }

  static async getTeam(req: Request<{ companyId: number; teamId: number }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const company = await CompanyService.findCompanyByUserId(id);
      const { companyId, teamId } = req.params;

      if (Number(company.id) !== Number(companyId)) {
        loggerInstance.error('There was an error retrieving the team, the user does not belong to the company');
        next('There was an error retrieving the team, the user does not belong to the company');
      }

      const planCredit = await PlanCredit.findOne({
        where: { planId: teamId },
      });
      const plan = await Plan.findByPk(teamId, {
        include: {
          model: Country,
          include: [{ model: Currency, attributes: [['value', 'currencyValue']], include: [{ model: Credits }] }],
        },
      });

      res.send({ ...plan.toJSON(), planCredit });
    } catch (error) {
      loggerInstance.error('There was an error retrieving the team', error);
      next(error);
    }
  }

  static async updateTeam(req: Request<{ companyId: number; teamId: number }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const company = await CompanyService.findCompanyByUserId(id);
      const { companyId, teamId } = req.params;

      if (Number(company.id) !== Number(companyId)) {
        loggerInstance.error('There was an error retrieving the team, the user does not belong to the company');
        next('There was an error retrieving the team, the user does not belong to the company');
      }

      const plan = await Plan.findByPk(teamId);
      await plan.update({ ...req.body, companyId });

      res.send(plan);
    } catch (error) {
      loggerInstance.error('There was an error editing the team data', error);
      next(error);
    }
  }
}
