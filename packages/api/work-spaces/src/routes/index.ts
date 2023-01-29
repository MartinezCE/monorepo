import express from 'express';
import authRouter from './auth';
import companyRouter from './company';
import locationsRouter from './location';
import clientsLocationsRouter from './clients-location';
import spacesRouter from './space';
import userRouter from './user';
import countryRouter from './country';
import amenitiesRouter from './amenity';
import spaceReservationsRouter from './space-reservation';
import spaceDiscountsRouter from './space-discounts';
import spaceDepositsRouter from './space-deposits';
import searchRouter from './search';
import blueprintRouter from './blueprint';
import creditsRouter from './credits';
import clientsInviteRouter from './clients-invite';
import floorRouter from './floors';
import adminRouter from './admin';
import seatRouter from './seat';
import slackRouter from './slack';
import clientValidationMiddleware from '../middlewares/clientValidationMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';
import planRouter from './plan';
import { UserRoleEnum } from '../common/enum/user';
import roleValidationMiddleware from '../middlewares/roleValidationMiddleware';
import usersRouter from './users';
import wimetAdminMiddleware from '../middlewares/wimetAdminMiddleware';
import impersonateRouter from './impersonate';
import formRouter from './form';
import checkinRouter from './checkin';
import seatReservationsRouter from './seat-reservations';
import WPMReservationController from '../controllers/wpm-reservation';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/countries', countryRouter);
router.use('/amenities', amenitiesRouter);
router.use('/locations', locationsRouter);
router.use('/spaces', spacesRouter);
router.use('/search', searchRouter);
router.use('/space-reservations', spaceReservationsRouter);

router.use('/impersonate', authMiddleware, wimetAdminMiddleware, impersonateRouter);
router.use('/admin', authMiddleware, adminRouter);
router.use('/floors', authMiddleware, floorRouter);
router.use('/credits', authMiddleware, creditsRouter);
router.use('/user', authMiddleware, userRouter);
router.use(
  '/users',
  authMiddleware,
  clientValidationMiddleware,
  roleValidationMiddleware([UserRoleEnum.ACCOUNT_MANAGER]),
  usersRouter
);
router.use('/clients-invitation', authMiddleware, clientValidationMiddleware, clientsInviteRouter);
router.use('/companies', companyRouter);
router.use('/clients-locations', authMiddleware, clientValidationMiddleware, clientsLocationsRouter);
router.use('/blueprints', authMiddleware, clientValidationMiddleware, blueprintRouter);
router.use('/seats', authMiddleware, clientValidationMiddleware, seatRouter);
router.use('/space-discounts', authMiddleware, spaceDiscountsRouter);
router.use('/space-deposits', authMiddleware, spaceDepositsRouter);
router.use('/slack', slackRouter);
router.use('/plans', authMiddleware, planRouter);
router.use('/form', formRouter);

router.use('/seat-reservations', authMiddleware, clientValidationMiddleware, seatReservationsRouter);
router.post('/google/webhook/seat-reservation', WPMReservationController.reserveSeatFromGoogle);

router.use('/checkin', checkinRouter);

export default router;
