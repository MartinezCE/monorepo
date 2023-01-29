import { LocationStatus } from '@wimet/apps-shared';

export const ProfileName = 'Usina Cowork';
export const LocationDistrict = 'Palermo';

export const LocationOptions = [
  { value: 'cowork', label: 'Co-work' },
  { value: 'office', label: 'Office' },
];

export const CountryOptions = [
  { value: 'mexico', label: 'México' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'chile', label: 'Chile' },
];

export const CitiesOptions = [{ value: 'df', label: 'DF' }];

export const SpacesListItems = [
  {
    id: 0,
    image: '/space_1.jpg',
    spaceName: 'Oficina Privada 1',
    spaceTypeName: 'Oficina Privada',
    spaceCapacity: 10,
    price: 100000,
    billingPeriod: 'mes',
    minTerm: 1,
    status: LocationStatus.PUBLISHED,
    statusText: 'Publicado',
    percentageCompleted: 100,
  },
  {
    id: 1,
    image: '/space_1.jpg',
    spaceName: 'Oficina Privada 2',
    spaceTypeName: 'Oficina Privada',
    spaceCapacity: 8,
    price: 200000,
    billingPeriod: 'mes',
    minTerm: 1,
    status: LocationStatus.IN_PROCESS,
    statusText: 'En proceso',
    percentageCompleted: 32,
  },
  {
    id: 2,
    image: '/space_1.jpg',
    spaceName: 'Área común 1',
    spaceTypeName: 'Área común',
    spaceCapacity: 12,
    price: 80000,
    billingPeriod: 'mes',
    minTerm: 1,
    status: LocationStatus.IN_PROCESS,
    statusText: 'En proceso',
    percentageCompleted: 10,
  },
  {
    id: 3,
    image: '/space_1.jpg',
    spaceName: 'Área común 2',
    spaceTypeName: 'Área común',
    spaceCapacity: 16,
    price: 140000,
    billingPeriod: 'mes',
    minTerm: 1,
    status: LocationStatus.IN_PROCESS,
    statusText: 'En proceso',
    percentageCompleted: 50,
  },
  {
    id: 4,
    image: '/space_1.jpg',
    spaceName: 'Oficina Privada 3',
    spaceTypeName: 'Oficina Privada',
    spaceCapacity: 10,
    price: 300000,
    billingPeriod: 'mes',
    minTerm: 1,
    status: LocationStatus.IN_PROCESS,
    statusText: 'En proceso',
    percentageCompleted: 10,
  },
];

export const Amenities = [
  { id: 0, name: 'Estacionamiento' },
  { id: 1, name: 'Cocina' },
  { id: 2, name: 'Pet Friendly' },
  { id: 3, name: 'Restaurante & Café' },
  { id: 4, name: 'Exteriores' },
  { id: 5, name: 'Boxes para llamadas' },
  { id: 6, name: 'Seguridad' },
  { id: 7, name: 'Sector fumador' },
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
