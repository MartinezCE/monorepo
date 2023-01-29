import {
  AmenityType,
  BlueprintStatus,
  FileType,
  LocationStatus,
  WPMReservationTypes,
  SpaceTypeEnum,
  UserRole,
  UserType,
  UserStatus,
  SpaceReservationType,
  SpaceReservationHourlyTypes,
  PlanTypes,
  PlanStatus,
} from '../utils';

export type SpaceType = {
  id: number;
  value: SpaceTypeEnum;
  createdAt: Date;
  updatedAt: Date;
};

export type SpaceFile = {
  id: number;
  spaceId: number;
  type: FileType;
  url: string;
  mimetype: string;
  name: string;
  key: string;
  createdAt: string;
  updatedAt: string;
};

export type TabItem = { label: string; id: number | string };

export type FilterOption = {
  label: string;
  value: string;
};

export type LayoutVariant = 'orange' | 'blue' | 'transparent' | 'gray' | 'sky' | 'lighterGray' | 'white';

export type Country = {
  id: number;
  iso3: string;
  name: string;
  currencyId: number;
  createdAt: string;
  updatedAt: string;
};

export type State = {
  id?: number;
  countryId?: number;
  country?: Country;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Company = {
  id: number;
  name: string;
  companies_users: {
    companyId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
  }[];
  state: State;
  companyTypeId: number;
  stateId: number;
  peopleAmount?: number;
  feePercentage?: {
    id: number;
    value: number;
    companyId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
  } | null;
  websiteUrl?: string;
  tz: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  email: string;
  isWimetAdmin?: boolean;
  companies: Company[];
  createdAt: string;
  updatedAt: string;
  profileUrl: string;
  status?: UserStatus;
  authProviders: any;
  userType: {
    id: number;
    value: UserType;
    createdAt: string;
    updatedAt: string;
  };
  userRole?: {
    id: number;
    value: UserRole;
    createdAt: string;
    updatedAt: string;
  };
  companyRole: string;
  isWPMEnabled: boolean;
  avatarUrl: string;
  plans: unknown[];
};

export type CompanyWPMUser = Partial<User> & {
  blueprints: Blueprint[];
};

export type CompanyBlueprint = Blueprint & {
  floor: {
    number: number;
    location: {
      name: string;
    };
  };
};

export type Amenity = {
  id: number;
  name: string;
  type: AmenityType;
  fileName: string;
  isDefault: boolean;
  seats: Seat[];
  blueprints?: Blueprint[];
  createdAt: string;
  updatedAt: string;
};

export type LocationAmenity = {
  id: number;
  amenityId: number;
  locationId: number;
  amenity?: Amenity;
  location?: Location;
  createdAt: string;
  updatedAt: string;
};

export type SpaceAmenity = {
  id: number;
  amenityId: number;
  spaceId: number;
  amenity?: Amenity;
  space?: Space;
  createdAt: string;
  updatedAt: string;
};

export type LocationFile = {
  id: number;
  locationId: number;
  type: FileType;
  url: string;
  mimetype: string;
  name: string;
  key: string;
  createdAt: string;
  updatedAt: string;
};

export type Location = {
  id: number;
  companyId: number;
  latitude?: string;
  longitude?: string;
  description?: string;
  address?: string;
  tourUrl?: string;
  comments?: string;
  accessCode?: string;
  status: LocationStatus;
  streetName: string;
  streetNumber: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
  company: Company;
  currencyId: number;
  locationsAmenities: any; // TODO: fix types{ [k in AmenityType]: Amenity[] } | LocationAmenity[];
  locationFiles: {
    [key: string]: LocationFile[];
  };
  spaceCount?: {
    spaceTypeId: number;
    value: SpaceTypeEnum;
    count: number;
  }[];
  spaces?: Space[];
  percentage: string;
  nextNullField: string;
  stateId: number;
  name: string;
};

export type Hourly = {
  id: number;
  price: string;
  halfDayPrice: string;
  fullDayPrice: string;
  minHoursAmount: number;
  dayOfWeek: number;
  spaceId: number;
  dayCreditsWithFee: number;
  halfDayCreditsWithFee: number;
  fullDayCreditsWithFee: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SpaceSchedule = {
  id?: number;
  dayOfWeek?: number;
  is24Open?: boolean;
  openTime?: string;
  closeTime?: string;
};

export type Space = {
  id: number;
  name: string;
  tourUrl?: string;
  peopleCapacity: number;
  area: string;
  spaceOfferId?: number;
  createdAt: Date;
  updatedAt: Date;
  locationId: number;
  spaceTypeId: number;
  spaceReservationTypeId: number;
  order?: Number | null;
  spaceReservationType: {
    id: number;
    value: SpaceReservationType;
    createdAt: Date;
    updatedAt: Date;
  };
  location: Location;
  spacesAmenities: { [k in AmenityType]: Amenity[] };
  spaceFiles: {
    [key: string]: SpaceFile[];
  };
  spaceType: SpaceType;
  monthly: {
    id: number;
    price: number;
    minMonthsAmount: number;
    maxMonthsAmount: number;
    createdAt: Date;
    updatedAt: Date;
    spaceId: number;
    spaceDiscounts: {
      id: number;
      monthsAmount: number;
      spaceDiscountMonthlySpace: {
        percentage: string;
      };
    }[];
    spaceDeposits: {
      id: number;
      monthsAmount: number;
    }[];
  };
  hourly: Hourly[];
  averageCreditsWithFee: number;
  schedule?: SpaceSchedule[];
  percentage: string;
  nextNullField: string;
};

export type Blueprint = {
  id: number;
  floorId: number;
  name: string;
  url: string;
  mimetype: string;
  key: string;
  status: BlueprintStatus;
  floor: Floor;
  seats?: Seat[];
  amenities?: Amenity[];
  createdAt: string;
  updatedAt: string;
};

export type Floor = {
  id: number;
  locationId: number;
  number: string;
  blueprints: Blueprint[];
  location?: Location;
  createdAt: string;
  updatedAt: string;
};
export type BlueprintFile = {
  id: number;
  type: FileType;
  url: string;
  mimetype: string;
  name: string;
  key: string;
  createdAt: string;
  updatedAt: string;
};

export type ClientLocation = Location & {
  floors: Floor[];
};

export declare type Seat = {
  id: number;
  blueprintId: number;
  blueprint?: Blueprint;
  name: string;
  isAvailable?: boolean;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  WPMReservations?: WPMReservation[];
  amenities?: Amenity[];
  spaceTypeId: number;
  spaceType?: SpaceType;
  createdAt: string;
  updatedAt: number;
};

export type SeatGoogle = {
  kind: string;
  etags: string;
  resourceId: string;
  resourceName: string;
  generatedResourceName: string;
  resourceType: string;
  resourceEmail: string;
  capacity: string;
  buildingId: string;
  floorName: string;
  resourceCategory: string;
};

export type Collaborator = {
  id: number;
  email: string;
  isRegistered: boolean;
  isWPMEnabled: boolean;
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  userRoleId: number;
  userRole: UserRole;
  userPlan: number;
  planName: string;
  companyRole?: string;
  blueprints?: Blueprint[];
  WPMReservations?: WPMReservation[];
  createdAt?: string;
  company?: Company;
  plan?: {
    name: string;
    usedCredits: number;
    credits: number;
  };
};

export type WPMReservation = {
  id: number;
  WPMReservationTypeId: number;
  WPMReservationType?: WPMReservationType;
  userId: number;
  user?: User;
  seatId: number;
  seat?: Seat;
  originTz: string;
  destinationTz: string;
  originOffset: number;
  destinationOffset: number;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  status: string;
};

export type WPMReservationType = {
  id: number;
  name: WPMReservationTypes;
  createdAt: string;
  updatedAt: string;
};

export type Discount = {
  id: number;
  months_amount: number;
};

export type Deposit = {
  id: number;
  months_amount: number;
};

export type Credit = {
  id: number;
  value: string;
  currencyId: number;
  createdAt: string;
  updatedAt: string;
  currency: Currency;
};

export type PlanType = {
  id: number;
  name: PlanTypes;
  initialCredits: number | null;
  createdAt: string;
  updatedAt: string;
};

export type HourlySpaceHistory = {
  id: number;
  previousHourlySpaceId: number;
  price: string;
  halfDayPrice: string;
  fullDayPrice: string;
  minHoursAmount: number;
  dayOfWeek: number;
  spaceId: number;
  createdAt: string;
  updatedAt: string;
};

export type HourlySpaceReservation = {
  id: number;
  userId: number;
  user?: User;
  spaceId: number;
  space: Space;
  planRenovationId: number;
  type: SpaceReservationHourlyTypes;
  hourlySpaceHistoryId: number;
  hourlySpaceHistory?: HourlySpaceHistory;
  feePercentageId: number;
  creditId: number;
  originTz: string;
  destinationTz: string;
  originOffset: number;
  destinationOffset: number;
  startDate: string;
  endDate: string;
  usedCredits?: number;
  createdAt: string;
  updatedAt: string;
};

export type Currency = {
  id: number;
  value: string;
  createdAt: string;
  updatedAt: string;
};

export type PlanRenovation = {
  id: number;
  planId: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  plan: Plan;
  usedCredits?: number;
  values?: {
    usedCredits: number;
    value: number;
    currencyId: number;
    currency: Currency;
  }[];
};

export type ClientPlan = Plan & {
  id: number;
  companyId: number;
  name: string;
  planTypeId: number;
  maxPersonalCredits: number;
  maxReservationCredits: number;
  startDate: string;
  status: PlanStatus;
  planType: PlanType;
  planRenovations: PlanRenovation[];
  users: User[];
  createdAt: string;
  updatedAt: string;
};

export type Plan = {
  id: number;
  companyId: number;
  planTypeId: number;
  availableCredits: number;
  name: string;
  status: PlanStatus;
  maxPersonalCredits: number;
  maxReservationCredits: number;
  startDate: string;
  isDeletable?: boolean;
  createdAt: string;
  updatedAt: string;
  usedCredits?: number;
  userUsedCredits?: number;
  planRenovations?: PlanRenovation[];
};

export type SpaceReservation = {
  id: number;
  spaceId: number;
  planRenovationId: number;
  type: SpaceReservationHourlyTypes;
  hourlySpaceHistoryId: number;
  feePercentageId: number;
  creditId: number;
  originTz: string;
  destinationTz: string;
  originOffset: number;
  destinationOffset: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  planRenovation: PlanRenovation;
  space: Space;
  usedCredits: number;
  user: User;
};
