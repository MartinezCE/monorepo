import {
  AmenityType,
  LocationStatus,
  SpaceTypeEnum,
  SpaceReservationType,
  BlueprintStatus,
  CollaboratorStatus,
  UserRole,
  PlanStatus,
  InvoiceStatus,
  WPMReservationTypes,
  PlanTypes,
  SpaceReservationHourlyTypes,
  BookingStatus,
} from './enums';

const statusLabels = {
  [LocationStatus.PENDING]: 'Pendiente de aprobación',
  [LocationStatus.IN_PROCESS]: 'En proceso',
  [LocationStatus.PUBLISHED]: 'Publicado',
};
export const getStatusLabel = (status: LocationStatus) => statusLabels[status];

export const blueprintStatusLabels = {
  [BlueprintStatus.PENDING]: 'Pendiente',
  [BlueprintStatus.PUBLISHED]: 'Publicado',
  [BlueprintStatus.DRAFT]: 'Borrador',
};
export const getBlueprintStatusLabel = (status: BlueprintStatus) => blueprintStatusLabels[status];

const spaceTypeLabels = {
  [SpaceTypeEnum.SHARED]: 'Escritorios Compartidos',
  [SpaceTypeEnum.MEETING_ROOM]: 'Sala de Reunión',
  [SpaceTypeEnum.PRIVATE_OFFICE]: 'Oficina Privada',
};

export const spaceTypeFilterLabels = {
  [SpaceTypeEnum.SHARED]: 'Escritorios',
  [SpaceTypeEnum.MEETING_ROOM]: 'Salas de Reunión',
  [SpaceTypeEnum.PRIVATE_OFFICE]: 'Oficinas',
};

// TODO: use directly spaceTypeLabels constant instead a function
export const getSpaceTypeLabel = (spaceType: SpaceTypeEnum) => spaceTypeLabels[spaceType];

export const spaceReservationLabels = {
  [SpaceReservationType.HOURLY]: 'Por hora/día',
  [SpaceReservationType.MONTHLY]: 'Por mes',
};

export const spaceReservationDescription = {
  [SpaceReservationType.HOURLY]: 'Reservar Escritorios y Salas de Reunión con créditos',
  [SpaceReservationType.MONTHLY]: 'Oficinas Privadas bajo términos flexibles',
};

export const SpacesTypesDescription = {
  [SpaceTypeEnum.SHARED]: 'Espacio compartido con escritorios individuales.',
  [SpaceTypeEnum.MEETING_ROOM]: 'Sala privada para un equipo.',
  [SpaceTypeEnum.PRIVATE_OFFICE]: 'Oficina para un individuo o un grupo de personas.',
};

export const getSpaceTypeDescription = (spaceType: SpaceTypeEnum) => SpacesTypesDescription[spaceType];

export const spaceReservationSingularLabels = {
  HOURLY: 'hora',
  MONTHLY: 'mes',
};

export const AmenityTypesLabels = {
  [AmenityType.LOCATION]: 'Locación',
  [AmenityType.SAFETY]: 'Seguridad e Higiene',
  [AmenityType.SPACE]: 'Espacio',
  [AmenityType.CUSTOM]: 'Tus amenities',
};

export const getAmenityTypeLabel = (amenityType: AmenityType) => AmenityTypesLabels[amenityType];

export const planStatusLabels = {
  [PlanStatus.ACTIVE]: 'Activo',
  [PlanStatus.PENDING]: 'Pendiente',
  [PlanStatus.PAUSED]: 'Pausado',
};

export const planTypesLabels = {
  [PlanTypes.CUSTOM]: 'Membresia',
  [PlanTypes.ENTERPRISE]: 'Pago por uso',
};

export const CollaboratorStatusLabels = {
  [CollaboratorStatus.PENDING]: 'Pendiente',
  [CollaboratorStatus.REGISTERED]: 'Registrado',
};

export const BookingsStatusLabels = {
  [BookingStatus.PENDING]: 'Check-in',
  [BookingStatus.DONE]: 'Confirmada',
  [BookingStatus.CANCEL]: 'Cancelada',
};

export const getCollaboratorStatusLabel = (collaboratorStatus: CollaboratorStatus) =>
  CollaboratorStatusLabels[collaboratorStatus];

export const UserRoleLabels = {
  [UserRole.ACCOUNT_MANAGER]: 'Account Manager',
  [UserRole.MEMBER]: 'Miembro',
  [UserRole.TEAM_MANAGER]: 'Team Manager',
};

export const UserRoleDescriptionLabels = {
  [UserRole.ACCOUNT_MANAGER]: 'Tiene acceso a Planes y Facturación',
  [UserRole.MEMBER]: 'Tiene acceso a Planes',
  [UserRole.TEAM_MANAGER]: 'Solo puede reservar espacios',
};

export const getUserRoleLabels = (collaboratorRole: UserRole) => UserRoleLabels[collaboratorRole];

export const getUserRoleDescriptionLabels = (collaboratorRole: UserRole) => UserRoleDescriptionLabels[collaboratorRole];

export const InvoiceStatusLabels = {
  [InvoiceStatus.OVERDUE]: 'Vencido',
  [InvoiceStatus.PAYED]: 'Abonado',
  [InvoiceStatus.PENDING]: 'Pendiente',
};

export const getInvoiceStatusLabels = (invoiceStatus: InvoiceStatus) => InvoiceStatusLabels[invoiceStatus];

export const WPMReservationTypeLabels = {
  [WPMReservationTypes.DAYPASS]: 'DayPass',
  [WPMReservationTypes.MORNING]: 'Mañana',
  [WPMReservationTypes.AFTERNOON]: 'Tarde',
  [WPMReservationTypes.CUSTOM]: 'Personalizado',
};

export const SpaceReservationHourlyLabels = {
  [SpaceReservationHourlyTypes.DAYPASS]: 'DayPass',
  [SpaceReservationHourlyTypes.HALF_DAY]: 'Medio día',
  [SpaceReservationHourlyTypes.PER_HOUR]: 'Por hora',
};

export const WPMReservationTypeLiveMapLabels = {
  [WPMReservationTypes.DAYPASS]: 'DayPass',
  [WPMReservationTypes.MORNING]: 'Medio día por la mañana',
  [WPMReservationTypes.AFTERNOON]: 'Medio día por la tarde',
  [WPMReservationTypes.CUSTOM]: 'Personalizado',
};
