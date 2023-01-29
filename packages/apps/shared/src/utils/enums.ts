export enum AmenityType {
  LOCATION = 'LOCATION',
  SPACE = 'SPACE',
  SAFETY = 'SAFETY',
  CUSTOM = 'CUSTOM',
}

export enum FileType {
  DOCUMENT = 'DOCUMENT',
  IMAGE = 'IMAGE',
}

export enum LocationStatus {
  PENDING = 'PENDING',
  IN_PROCESS = 'IN_PROCESS',
  PUBLISHED = 'PUBLISHED',
}

export enum BlueprintStatus {
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
}

export enum SpaceReservationType {
  HOURLY = 'HOURLY',
  MONTHLY = 'MONTHLY',
}

export enum SpaceTypeEnum {
  SHARED = 'SHARED',
  MEETING_ROOM = 'MEETING_ROOM',
  PRIVATE_OFFICE = 'PRIVATE_OFFICE',
}

export enum CharacteristicsCommonArea {
  OPEN_DESK = 'OPEN_DESK',
  PRIVATE_OFFICE = 'PRIVATE_OFFICE',
}

export enum UserType {
  PARTNER = 'PARTNER',
  CLIENT = 'CLIENT',
}

export enum UserRole {
  ACCOUNT_MANAGER = 'ACCOUNT_MANAGER',
  TEAM_MANAGER = 'TEAM_MANAGER',
  MEMBER = 'MEMBER',
}

export enum CollaboratorStatus {
  PENDING = 'PENDING',
  REGISTERED = 'REGISTERED',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
  CANCEL = 'CANCEL',
}

export enum PlanTypes {
  CUSTOM = 'CUSTOM',
  ENTERPRISE = 'ENTERPRISE',
}

export enum PlanStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  PAUSED = 'PAUSED',
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAYED = 'PAYED',
  OVERDUE = 'OVERDUE',
}

export enum WPMReservationTypes {
  DAYPASS = 'DAYPASS',
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  CUSTOM = 'CUSTOM',
}

export enum SpaceReservationHourlyTypes {
  PER_HOUR = 'PER_HOUR',
  HALF_DAY = 'HALF_DAY',
  DAYPASS = 'DAYPASS',
}

export enum SpaceReservationHalfDayTypes {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}
