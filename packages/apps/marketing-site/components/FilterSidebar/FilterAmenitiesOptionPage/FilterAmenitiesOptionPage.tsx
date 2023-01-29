import { AmenityButton, images } from '@wimet/apps-shared';
import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 18px;
  row-gap: 40px;
`;

const StyledAmenityButton = styled(AmenityButton)`
  & button {
    padding: 10px;
    background-color: ${({ theme }) => theme.colors.extraLightGray};
  }
  & span {
    font-size: 14px;
    line-height: 20px;
  }
`;

type Amenities = {
  id: number;
  name: string;
  selected: boolean;
  icon: string;
};

type Icon = {
  [key: string]: JSX.Element;
};

const ICONS: Icon = {
  printer: <images.Printer />,
};

const AMENITIES: Amenities[] = [
  { id: 1, name: 'Estacionamiento', selected: true, icon: 'printer' },
  { id: 2, name: 'Cocina', selected: false, icon: 'printer' },
  { id: 3, name: 'Pet Friendly', selected: false, icon: 'printer' },
  { id: 4, name: 'Restaurante & Café', selected: true, icon: 'printer' },
  { id: 5, name: 'Boxes para llamadas', selected: false, icon: 'printer' },
  { id: 6, name: 'Seguridad', selected: true, icon: 'printer' },
  { id: 7, name: 'Sector fumador', selected: false, icon: 'printer' },
  { id: 8, name: 'Exteriores', selected: false, icon: 'printer' },
  { id: 9, name: 'Monitores', selected: true, icon: 'printer' },
  { id: 10, name: 'Impresora', selected: false, icon: 'printer' },
  { id: 11, name: 'TV', selected: false, icon: 'printer' },
  { id: 12, name: 'Proyector', selected: true, icon: 'printer' },
  { id: 13, name: 'Pizarra', selected: false, icon: 'printer' },
  { id: 14, name: 'Audio', selected: false, icon: 'printer' },
];

const FilterAmenitiesOptionPage = () => (
  <StyledWrapper>
    {AMENITIES.map(amenity => (
      <StyledAmenityButton
        key={amenity.id}
        label={amenity.name}
        icon={ICONS[amenity.icon]}
        active={amenity.selected}
        onClick={() => {}}
      />
    ))}
  </StyledWrapper>
);

export default FilterAmenitiesOptionPage;
