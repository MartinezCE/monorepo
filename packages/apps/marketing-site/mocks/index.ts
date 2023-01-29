export const spaceBookingOptions = [
  { value: 1, label: 'Por hora/día', description: 'Reservar Escritorios y Salas de Reunión con créditos' },
  { value: 2, label: 'Por mes', description: 'Oficinas Privadas bajo términos flexibles' },
];

export const sortOptions = [
  { value: 1, label: 'Menor valor en créditos' },
  { value: 2, label: 'Mayor valor en créditos' },
];

export const discoverItems = [
  {
    id: '1',
    spaceName: 'Área Común I',
    companyName: 'Huerta Cowork',
    address: 'Palermo',
    location: {
      lat: -34.586006,
      lng: -58.432203,
    },
    availability: 'De 9 a 18 hs',
    credits: '24 créditos / día',
    quotas: '4 personas',
    images: [
      {
        id: 1,
        url: '/images/huerta-cowork-2.png',
        alt: '',
      },
      {
        id: 2,
        url: '/images/joy_cowork.png',
        alt: '',
      },
      {
        id: 3,
        url: '/images/comparison_ondemand_booking.png',
        alt: '',
      },
      {
        id: 4,
        url: '/images/comparison_ondemand_plans.png',
        alt: '',
      },
      {
        id: 5,
        url: '/images/joy_cowork.png',
        alt: '',
      },
    ],
  },
];

export const MOCK_RESERVATION_BASE_DATA = {
  spaceId: 1,
  companyName: 'Huerta Cowork',
  spaceType: 'monthly',
  address: 'El Salvador 1734, San Nicolás, Buenos Aires',
  spaceStyle: 'Escritorio',
};

export const MOCK_MONTHLY_RESERVATION_DATA = {
  ...MOCK_RESERVATION_BASE_DATA,
  dates: {
    dateFrom: new Date(2022, 11, 1),
    dateTo: new Date(2022, 11, 30),
    discountType: '3 meses -15%',
    discountValue: '$40.000',
    total: '$28.000',
  },
};
