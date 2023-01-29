import {
  BlueprintStatus,
  UserRole,
  CollaboratorStatus,
  getBlueprintStatusLabel,
  PlanStatus,
  LocationStatus,
  getUserRoleLabels,
  getUserRoleDescriptionLabels,
} from '@wimet/apps-shared';
import { InvoiceStatus } from '@wimet/apps-shared/src/utils/enums';
import { addDays } from 'date-fns';
import { planRules } from '../components/PlansPage/RulesSelect/RulesSelect';
import type { Plan } from '../pages/pass/plans/list';

export const ACCOUNT_COUNTRIES_OPTIONS = [
  {
    value: 'AR',
    label: 'Argentina',
  },
  {
    value: 'BR',
    label: 'Brasil',
  },
];

export const ACCOUNT_CITY_OPTIONS = [
  {
    value: 'Buenos Aires',
    label: 'Buenos Aires',
  },
  {
    value: 'Cordoba',
    label: 'Cordoba',
  },
];

export const ACCOUNT_COLLABORATORS_OPTIONS = [
  {
    value: '20 - 50',
    label: '20 - 50',
  },
  {
    value: '50 - 100',
    label: '50 - 100',
  },
];

export const ACCOUNT_CONTACT_INFO = [
  {
    id: 1,
    name: 'Federico',
    position: 'Account Manager',
    image: null,
    lastname: 'Bianchi',
    email: 'melisafer@litebox.ai',
    password: 'mypassword',
    phone: '11 4637 4380',
  },
  {
    id: 2,
    name: 'Melisa',
    lastname: 'Fernández',
    image: '/images/contact_1.jpg',
    email: 'melisafer@litebox.ai',
    password: 'mypassword',
    phone: '11 4637 4380',
    position: 'RRHH',
  },
];

export const CompanyMock = {
  id: 1,
  name: 'Wimet',
  companies_users: [
    {
      companyId: 1,
      userId: 1,
      createdAt: '',
      updatedAt: '',
    },
  ],
  state: {
    id: 1,
    countryId: 1,
    name: 'La Plata',
  },
  companyTypeId: 1,
  stateId: 1,
  createdAt: '',
  updatedAt: '',
};

export const SpaceCountMock = [
  {
    spaceTypeId: 1,
    value: 'SHARED',
    count: 2,
  },
];

export const LOCATIONS = [
  {
    id: 1,
    name: 'Contract Workplaces',
    status: LocationStatus.IN_PROCESS,
    locationFiles: {},
    company: CompanyMock,
    address: 'Manuel Ugarte 1665',
    percentage: 0.45,
    area: '8 Áreas comunes',
    description: 'Descripción de la ubicación super nice :)',
    blueprints: [
      {
        id: 0,
        image: '/blueprint_1.jpg',
        spaceName: 'Espacio Amarillo',
        floor: 'Piso 5',
        avaliable: 24,
        occupied: 8,
        status: BlueprintStatus.PUBLISHED,
        statusText: getBlueprintStatusLabel(BlueprintStatus.PUBLISHED),
      },
      {
        id: 1,
        image: '/blueprint_1.jpg',
        spaceName: 'Espacio Grande',
        floor: 'Piso 6',
        avaliable: 32,
        occupied: 0,
        status: BlueprintStatus.PENDING,
        statusText: getBlueprintStatusLabel(BlueprintStatus.PENDING),
      },
      {
        id: 2,
        image: '/blueprint_1.jpg',
        spaceName: 'Zona Amplia',
        floor: 'Piso 8',
        status: BlueprintStatus.DRAFT,
        statusText: getBlueprintStatusLabel(BlueprintStatus.DRAFT),
      },
    ],
  },
];

export const PlanListData: Plan[] = [
  // {
  //   name: 'Starter',
  //   variations: [
  //     {
  //       credits: '20',
  //       monthValue: '5.000',
  //       creditValue: '250',
  //       visitRange: '1-3',
  //     },
  //   ],
  // },
  // {
  //   name: 'Team',
  //   variations: [
  //     {
  //       label: 'Team (+3)',
  //       value: 'team1',
  //       credits: '100',
  //       monthValue: '5.000',
  //       creditValue: '250',
  //       visitRange: '~16',
  //     },
  //     {
  //       label: 'Team (+5)',
  //       value: 'team2',
  //       credits: '150',
  //       monthValue: '5.000',
  //       creditValue: '250',
  //       visitRange: '~20',
  //     },
  //   ],
  // },
  // {
  //   percentage: 20,
  //   variations: [
  //     {
  //       credits: '250',
  //       value: 'team2',
  //       monthValue: '5.000',
  //       creditValue: '250',
  //       visitRange: '~20',
  //     },
  //   ],
  // },
  {
    name: 'monthly',
    title: 'Monthly',
    variations: [
      {
        credits: 'PAY AS YOU GO',
        title: 'Grandes equipos',
        description: 'Una modalidad pensada para empresas con más de 50 colaboradores.',
      },
    ],
  },
  {
    name: 'pay-as-you-go',
    title: 'Plan de créditos',
    variations: [
      {
        credits: 'PAY AS YOU GO',
        title: 'Grandes equipos',
        description: 'Una modalidad pensada para empresas con más de 50 colaboradores.',
      },
    ],
  },
];

export const COLLABORATORS_DATA = [
  {
    id: 1,
    name: 'Melisa',
    lastname: 'Fernández',
    image: '/images/contact_1.jpg',
    email: 'melisafer@litebox.ai',
    role: UserRole.ACCOUNT_MANAGER,
    plan: 'Semanal',
    planHours: 24,
    planCredits: 1000,
    status: CollaboratorStatus.REGISTERED,
  },
  {
    id: 2,
    name: 'Analía',
    lastname: 'Torres',
    image: '/images/contact_1.jpg',
    email: 'analiatorres@litebox.ai',
    role: UserRole.MEMBER,
    plan: 'Semanal',
    planHours: 24,
    planCredits: 1000,
    status: CollaboratorStatus.REGISTERED,
  },
  {
    id: 3,
    name: 'Mariano',
    lastname: 'Din',
    email: 'mdin@litebox.ai',
    role: UserRole.MEMBER,
    plan: 'Semanal',
    planHours: 24,
    planCredits: 1000,
    status: CollaboratorStatus.REGISTERED,
  },
  {
    id: 4,
    name: 'Nicolás',
    lastname: 'Trillo',
    email: 'nicotrillo@litebox.ai',
    role: UserRole.MEMBER,
    plan: 'Nómade',
    planHours: 18,
    planCredits: 500,
    status: CollaboratorStatus.PENDING,
  },
  {
    id: 5,
    name: 'Juan',
    lastname: 'Carreras',
    email: 'juan@litebox.ai',
    role: UserRole.MEMBER,
    status: CollaboratorStatus.PENDING,
  },
];

export const LocationsMock = [
  {
    value: 'Locación 1',
    label: 'Locación 1',
  },
  {
    value: 'Locación 2',
    label: 'Locación 2',
  },
  {
    value: 'Locación 3',
    label: 'Locación 3',
  },
];

export const RESERVE_DATA = [
  {
    id: 1,
    name: 'A3 Salvador',
    type: 'Sala de Reunión',
    date: new Date('2022-03-02'),
    reservedAt: new Date('2022-03-02'),
    usedCredits: 35,
    leftCredits: 250,
    member: {
      id: 1,
      name: 'Camila',
      lastname: 'Méndez',
    },
  },
  {
    id: 2,
    name: 'Huerta Cowork',
    date: new Date('2022-02-26'),
    reservedAt: new Date('2022-03-02'),
    type: 'Escritorio',
    usedCredits: 20,
    leftCredits: 285,
    member: {
      id: 2,
      name: 'Melisa',
      lastname: 'Fernández',
    },
  },
  {
    id: 3,
    name: 'Ronda',
    date: new Date('2022-02-24'),
    reservedAt: new Date('2022-03-02'),
    type: 'Oficina Privada',
    usedCredits: 19,
    leftCredits: 205,
    member: {
      id: 3,
      name: 'Federico',
      lastname: 'Torres',
    },
  },
  {
    id: 4,
    name: 'Huerta Cowork',
    date: new Date('2022-01-26'),
    reservedAt: new Date('2022-03-02'),
    type: 'Sala de Reunión',
    usedCredits: 32,
    leftCredits: 332,
    member: {
      id: 4,
      name: 'Agustina',
      lastname: 'Lagos',
    },
  },
  {
    id: 5,
    name: 'A3 Soho',
    date: new Date('2022-01-12'),
    reservedAt: new Date('2022-03-02'),
    type: 'Sala de Reunión',
    usedCredits: 15,
    leftCredits: 350,
    member: {
      id: 5,
      name: 'Mariano',
      lastname: 'Gómez',
    },
  },
];

export const INVOICES_DATA = [
  {
    id: 1,
    month: 'Septiembre',
    description: 'A3 Salvador',
    invoice: {
      id: 1,
      number: 'WT0020-CC001',
    },
    date: new Date('2022-03-12'),
    amount: '40.000',
    status: InvoiceStatus.PENDING,
  },
  {
    id: 2,
    month: 'Agosto',
    description: 'Huerta Cowork',
    invoice: {
      id: 2,
      number: 'WT0020-CC022',
    },
    date: new Date('2022-02-11'),
    amount: '38.000',
    status: InvoiceStatus.PAYED,
  },
  {
    id: 3,
    month: 'Julio',
    description: 'Ronda',
    invoice: {
      id: 3,
      number: 'WT0020-CC032',
    },
    date: new Date('2022-01-12'),
    amount: '35.000',
    status: InvoiceStatus.OVERDUE,
  },
  {
    id: 4,
    month: 'Junio',
    description: 'A3 Soho',
    invoice: {
      id: 4,
      number: 'WT0020-CC022',
    },
    date: new Date('2022-02-11'),
    amount: '38.000',
    status: InvoiceStatus.PAYED,
  },
  {
    id: 5,
    month: 'Mayo',
    description: 'Ronda',
    invoice: {
      id: 4,
      number: 'WT0020-CC032',
    },
    date: new Date('2022-01-12'),
    amount: '35.000',
    status: InvoiceStatus.PAYED,
  },
];

export const USERS_DATA = [
  {
    id: 1,
    name: 'Melisa',
    lastname: 'Fernández',
    image: '/images/contact_1.jpg',
    email: 'melisafer@litebox.ai',
    blueprintAccess: 3,
    wpm: true,
  },
  {
    id: 2,
    name: 'Analía',
    lastname: 'Torres',
    image: '/images/contact_1.jpg',
    email: 'analiatorres@litebox.ai',
    blueprintAccess: 4,
    wpm: true,
  },
  {
    id: 3,
    name: 'Mariano',
    lastname: 'Din',
    email: 'mdin@litebox.ai',
    blueprintAccess: 1,
    wpm: true,
  },
  {
    id: 4,
    name: 'Nicolás',
    lastname: 'Trillo',
    email: 'nicotrillo@litebox.ai',
    blueprintAccess: 5,
    wpm: false,
  },
  {
    id: 5,
    name: 'Juan',
    lastname: 'Carreras',
    email: 'juan@litebox.ai',
    blueprintAccess: 0,
    wpm: true,
  },
];

export const PLANS = [
  {
    id: 1,
    name: 'Sales Team',
    type: 'Starter',
    status: PlanStatus.ACTIVE,
    collaborators: 18,
    availableCredits: 154,
    credits: 250,
    start: new Date('2021-06-01'),
    renovation: new Date('2021-07-01'),
    price: 77.25,
    paymentAccountDetails: {
      type: 'Débito en cuenta',
      accountNumber: '374823',
      owner: 'Melisa Fernández',
      cuitCuil: '27-32456478-1',
      entity: 'BBVA Argentina',
      accountType: 'Caja de ahorro',
    },
    invoices: [...INVOICES_DATA],
    reserves: [...RESERVE_DATA],
    collaboratorsList: [...COLLABORATORS_DATA],
    planRulesId: [planRules[0]],
    maxCreditsPerMonth: 60,
    maxCreditsPerReserve: 24,
  },
  {
    id: 2,
    name: 'Nómade',
    type: 'Team',
    status: PlanStatus.PENDING,
    collaborators: 25,
    availableCredits: 1000,
    credits: 1000,
    start: new Date('2022-04-13'),
    renovation: new Date('2022-07-13'),
    price: 225.25,
    invoices: [],
    reserves: [],
    collaboratorsList: [...COLLABORATORS_DATA, ...COLLABORATORS_DATA],
    planRulesId: [planRules[1], planRules[2]],
    maxCreditsPerMonth: 60,
    maxCreditsPerReserve: 24,
  },
  {
    id: 3,
    name: 'Seniors',
    type: 'Team',
    status: PlanStatus.PAUSED,
    collaborators: 4,
    availableCredits: 1000,
    credits: 1000,
    start: new Date('2022-04-13'),
    renovation: new Date('2022-07-13'),
    price: 225.25,
    paymentAccountDetails: {
      type: 'Débito en cuenta',
      accountNumber: '374823',
      owner: 'Melisa Fernández',
      cuitCuil: '27-32456478-1',
      entity: 'BBVA Argentina',
      accountType: 'Caja de ahorro',
    },
    invoices: [...INVOICES_DATA],
    reserves: [...RESERVE_DATA],
    collaboratorsList: [...COLLABORATORS_DATA],
    planRulesId: [planRules[0], planRules[2]],
    maxCreditsPerMonth: 60,
    maxCreditsPerReserve: 24,
  },
  {
    id: 4,
    name: 'Plan V',
    type: 'Enterprise',
    status: PlanStatus.ACTIVE,
    collaborators: 1209,
    usedCredits: 278,
    start: new Date('2022-04-13'),
    renovation: new Date('2022-07-13'),
    paymentAccountDetails: {
      type: 'Débito en cuenta',
      accountNumber: '374823',
      owner: 'Melisa Fernández',
      cuitCuil: '27-32456478-1',
      entity: 'BBVA Argentina',
      accountType: 'Caja de ahorro',
    },
    invoices: [...INVOICES_DATA],
    reserves: [...RESERVE_DATA],
    collaboratorsList: [...COLLABORATORS_DATA],
    planRulesId: null,
    maxCreditsPerMonth: 60,
    maxCreditsPerReserve: 24,
  },
];

export const COUNTRY_OPTIONS = [
  {
    value: 'AR',
    label: 'Argentina',
  },
  {
    value: 'BR',
    label: 'Brasil',
  },
];

export const PROVINCE_OPTIONS = [
  {
    value: 'Buenos Aires',
    label: 'Buenos Aires',
  },
  {
    value: 'Catamarca',
    label: 'Catamarca',
  },
];
export const MOCKED_SEAT_DATA = [
  {
    seat: 'T6',
    area: 'Azul',
    floor: 4,
  },
  {
    seat: 'B3',
    area: 'Azul',
    floor: 4,
  },
];

export const MOCKED_POPUP_FEATURE_LIST = ['Sillas ergonómicas', 'Open Office', 'Zona abierta'];

export const BOOKINGS_DATA = [
  {
    id: 1,
    spaceName: 'A3 Salvador',
    spaceType: 'Escritorio',
    image: '/images/space_1.png',
    createdAt: new Date('2022-04-12'),
    bookedAt: new Date('2022-04-22'),
    planName: 'Plan semanal',
    totalCredits: 150,
    spaceCredits: 24,
    userName: 'Camila Mendez',
    coinCode: 'WT0020-CC001',
  },
  {
    id: 2,
    spaceName: 'Huerta Cowork',
    spaceType: 'Oficina',
    image: '/images/space_1.png',
    createdAt: new Date('2022-04-12'),
    bookedAt: new Date('2022-04-22'),
    planName: 'Plan Nómade',
    totalCredits: 150,
    spaceCredits: 24,
    userName: 'Melisa Fernandez',
    coinCode: 'WT0020-CC001',
  },
  {
    id: 3,
    spaceName: 'Ronda y Co.',
    spaceType: 'Sala de reunion',
    image: '/images/space_1.png',
    createdAt: new Date('2022-04-12'),
    bookedAt: new Date('2022-04-22'),
    planName: 'Plan V',
    totalCredits: 150,
    spaceCredits: 24,
    userName: 'Facundo Morales',
    coinCode: 'WT0020-CC001',
  },
  {
    id: 4,
    spaceName: 'A3 Soho',
    spaceType: 'Escritorio',
    image: '/images/space_1.png',
    createdAt: new Date('2022-04-12'),
    bookedAt: new Date('2022-04-22'),
    planName: 'Plan semanal',
    totalCredits: 150,
    spaceCredits: 24,
    userName: 'Nico Baez',
    coinCode: 'WT0020-CC001',
  },
  {
    id: 5,
    spaceName: 'Living Cowork',
    spaceType: 'Sala de reunion',
    image: '/images/space_1.png',
    createdAt: new Date('2022-04-12'),
    bookedAt: new Date('2022-04-22'),
    planName: 'Plan mensual',
    totalCredits: 150,
    spaceCredits: 24,
    userName: 'Florencia Rinaldi',
    coinCode: 'WT0020-CC001',
  },
];

export const ROLE_OPTIONS = [
  {
    label: getUserRoleLabels(UserRole.ACCOUNT_MANAGER),
    value: 1,
    description: getUserRoleDescriptionLabels(UserRole.ACCOUNT_MANAGER),
  },
  {
    label: getUserRoleLabels(UserRole.MEMBER),
    value: 2,
    description: getUserRoleDescriptionLabels(UserRole.MEMBER),
  },
  {
    label: getUserRoleLabels(UserRole.TEAM_MANAGER),
    value: 3,
    description: getUserRoleDescriptionLabels(UserRole.TEAM_MANAGER),
  },
];

export const BOOKINGS_DATES = [
  {
    date: addDays(new Date(), 1),
    type: 1,
  },
  {
    date: addDays(new Date(), 8),
    type: 2,
  },
  {
    date: addDays(new Date(), 2),
    type: 3,
  },
];

export const SEATS_AMENITIES = [
  {
    value: 1,
    label: 'Baño privado',
  },
  {
    value: 2,
    label: 'Asientos ergonomicos',
  },
  {
    value: 3,
    label: 'Silla gamer',
  },
  {
    value: 4,
    label: 'Smart TV',
  },
  {
    value: 5,
    label: 'Armario',
  },
];
