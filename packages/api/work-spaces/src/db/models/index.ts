/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import fs from 'fs';
import path from 'path';
import { Model } from 'sequelize';
import Amenity from './Amenity';
import Company from './Company';
import Country from './Country';
import Location from './Location';
import LocationAmenity from './LocationAmenity';
import Space from './Space';
import SpaceAmenity from './SpaceAmenity';
import State from './State';
import User from './User';
import SpaceType from './SpaceType';
import SpaceReservationType from './SpaceReservationType';
import LocationFile from './LocationFile';
import SpaceFile from './SpaceFile';
import MonthlySpace from './MonthlySpace';
import SpaceDeposit from './SpaceDeposit';
import SpaceSchedule from './SpaceSchedule';
import HourlySpace from './HourlySpace';
import CompanyType from './CompanyType';
import SpaceOffer from './SpaceOffer';
import SpaceDiscount from './SpaceDiscount';
import SpaceDiscountMonthlySpace from './SpaceDiscountMonthlySpace';
import UserType from './UserType';
import Currency from './Currency';
import Floor from './Floor';
import Blueprint from './Blueprint';
import Seat from './Seat';
import Credits from './Credits';
import UserRole from './UserRole';
import WPMReservation from './WPMReservation';
import WPMReservationType from './WPMReservationType';
import FeePercentage from './FeePercentage';
import HourlySpaceHistory from './HourlySpaceHistory';
import HourlySpaceReservation from './HourlySpaceReservation';
import Plan from './Plan';
import PlanRenovation from './PlanRenovation';
import PlanType from './PlanType';
import UserAmenity from './UserAmenity';
import WimetBills from './WimetBills';
import CompanyAmenity from './CompanyAmenity';
import SeatAmenity from './SeatAmenity';
import PlanCredit from './PlanCredit';
import CompanyForm from './CompanyForm';

Country.hasMany(State);
Country.belongsTo(Currency);
Currency.hasOne(Country);
State.belongsTo(Country);

User.belongsToMany(Company, {
  through: {
    paranoid: true,
    model: 'companies_users',
  },
});
Company.belongsToMany(User, {
  through: {
    paranoid: true,
    model: 'companies_users',
  },
});
User.belongsTo(UserType);
User.belongsTo(UserRole);

User.belongsToMany(Blueprint, { through: { model: 'users_blueprints' } });
Blueprint.belongsToMany(User, { through: { model: 'users_blueprints' } });

Company.belongsTo(State);
State.hasMany(Company);
Company.belongsTo(CompanyType);
Company.hasMany(Location, { onDelete: 'CASCADE' });

FeePercentage.belongsTo(Company);
Company.hasOne(FeePercentage);

Location.belongsTo(Company, { onDelete: 'CASCADE' });
Location.belongsTo(Currency);

Location.hasMany(LocationAmenity, { onDelete: 'CASCADE' });
Location.hasMany(LocationFile, { onDelete: 'CASCADE' });
Location.hasMany(Space, { onDelete: 'CASCADE' });

LocationAmenity.belongsTo(Location, { onDelete: 'CASCADE' });
LocationAmenity.belongsTo(Amenity, { onDelete: 'CASCADE' });

SpaceAmenity.belongsTo(Space, { onDelete: 'CASCADE' });
SpaceAmenity.belongsTo(Amenity, { onDelete: 'CASCADE' });

SpaceType.belongsToMany(SpaceReservationType, { through: 'space_reservation_types_space_types' });
SpaceReservationType.belongsToMany(SpaceType, { through: 'space_reservation_types_space_types' });

SpaceType.belongsToMany(SpaceOffer, { through: 'space_offers_space_types' });
SpaceOffer.belongsToMany(SpaceType, { through: 'space_offers_space_types' });

LocationFile.belongsTo(Location, { onDelete: 'CASCADE' });
SpaceFile.belongsTo(Space, { onDelete: 'CASCADE' });

MonthlySpace.belongsTo(Space, { onDelete: 'CASCADE' });

HourlySpace.belongsTo(Space, { onDelete: 'CASCADE' });
Space.hasMany(HourlySpace, { onDelete: 'CASCADE' });

SpaceDeposit.belongsToMany(MonthlySpace, { through: 'space_deposits_monthly_spaces', onDelete: 'CASCADE' });
MonthlySpace.belongsToMany(SpaceDeposit, { through: 'space_deposits_monthly_spaces', onDelete: 'CASCADE' });

SpaceDiscount.belongsToMany(MonthlySpace, {
  through: SpaceDiscountMonthlySpace,
  uniqueKey: 'space_discount_monthly_space_unique',
  onDelete: 'CASCADE',
});
MonthlySpace.belongsToMany(SpaceDiscount, {
  through: SpaceDiscountMonthlySpace,
  uniqueKey: 'monthly_space_space_discount_unique',
  onDelete: 'CASCADE',
});

SpaceSchedule.belongsTo(Space, { onDelete: 'CASCADE' });

Space.hasMany(SpaceSchedule, { onDelete: 'CASCADE' });
Space.hasMany(SpaceAmenity, { onDelete: 'CASCADE' });
Space.hasMany(SpaceFile, { onDelete: 'CASCADE' });
Space.belongsTo(Location, { onDelete: 'CASCADE' });
Space.belongsTo(SpaceType);
Space.belongsTo(SpaceReservationType);
Space.belongsTo(SpaceOffer);

Location.hasMany(Floor, { onDelete: 'CASCADE' });
Floor.belongsTo(Location);

Floor.hasMany(Blueprint, { onDelete: 'CASCADE' });
Blueprint.belongsTo(Floor);

Blueprint.hasMany(Seat, { onDelete: 'CASCADE' });
Seat.belongsTo(Blueprint, { onDelete: 'CASCADE' });

Credits.belongsTo(Currency);
Currency.hasOne(Credits);

Seat.belongsToMany(Amenity, { through: SeatAmenity, onDelete: 'CASCADE' });
Amenity.belongsToMany(Seat, { through: SeatAmenity, onDelete: 'CASCADE' });

Company.belongsToMany(Amenity, { through: CompanyAmenity });
Amenity.belongsToMany(Company, { through: CompanyAmenity });

User.hasMany(WPMReservation);
WPMReservation.belongsTo(User);

WPMReservationType.hasMany(WPMReservation, { foreignKey: 'wpm_reservation_type_id', onDelete: 'CASCADE' });
WPMReservation.belongsTo(WPMReservationType, { foreignKey: 'wpm_reservation_type_id', onDelete: 'CASCADE' });

Seat.hasMany(WPMReservation);
WPMReservation.belongsTo(Seat);

HourlySpaceHistory.hasMany(HourlySpaceReservation);
HourlySpaceReservation.belongsTo(HourlySpaceHistory);

FeePercentage.hasMany(HourlySpaceReservation);
HourlySpaceReservation.belongsTo(FeePercentage);

User.hasMany(HourlySpaceReservation);
HourlySpaceReservation.belongsTo(User);

Credits.hasMany(HourlySpaceReservation);
HourlySpaceReservation.belongsTo(Credits);

Space.hasMany(HourlySpaceReservation);
HourlySpaceReservation.belongsTo(Space);

Company.hasMany(Plan);
Plan.belongsTo(Company);

User.belongsToMany(Plan, { through: { paranoid: true, model: 'plan_users' }, onDelete: 'CASCADE' });
Plan.belongsToMany(User, { through: { paranoid: true, model: 'plan_users' }, onDelete: 'CASCADE' });

PlanType.hasMany(Plan, { onDelete: 'CASCADE' });
Plan.belongsTo(PlanType, { onDelete: 'CASCADE' });

Plan.hasMany(PlanRenovation);
PlanRenovation.belongsTo(Plan);

PlanRenovation.hasMany(HourlySpaceReservation);
HourlySpaceReservation.belongsTo(PlanRenovation);

HourlySpaceReservation.belongsTo(User);

User.belongsToMany(Amenity, { through: UserAmenity, onDelete: 'CASCADE' });
Amenity.belongsToMany(User, { through: UserAmenity, onDelete: 'CASCADE' });

Blueprint.belongsToMany(Amenity, { through: UserAmenity, onDelete: 'CASCADE' });
Amenity.belongsToMany(Blueprint, { through: UserAmenity, onDelete: 'CASCADE' });

Company.hasMany(WimetBills);
WimetBills.belongsTo(Company);

PlanRenovation.hasMany(WimetBills);
WimetBills.belongsTo(PlanRenovation);

Plan.hasOne(PlanCredit);
PlanCredit.belongsTo(Plan);

Country.hasMany(Plan);
Plan.belongsTo(Country);

Credits.hasMany(PlanCredit);
PlanCredit.belongsTo(Credits);

PlanCredit.hasMany(PlanRenovation);
PlanRenovation.belongsTo(PlanCredit);

SpaceType.hasMany(Seat);
Seat.belongsTo(SpaceType);

CompanyForm.belongsTo(Company, { onDelete: 'CASCADE' });
Company.hasMany(CompanyForm, { onDelete: 'CASCADE' });

fs.readdirSync(__dirname)
  .filter(file => {
    return !file.includes('index');
  })
  .map(async file => {
    require(path.join(__dirname, file)).default as typeof Model;
  });
