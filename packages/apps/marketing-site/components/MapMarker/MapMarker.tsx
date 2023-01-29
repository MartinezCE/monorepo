import { Location, pluralize, Space, SpaceType, theme } from '@wimet/apps-shared';
import Image from 'next/image';
import styled from 'styled-components';
import { getSpaceReferencePrice, showPeopleCapacity } from '../../utils/space';

type Colors = {
  [key: string]: string;
};

const StyledText = styled.p<{ size?: string; weight?: string; color?: string; margin?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: ${({ size }) => size || '14px'};
  font-weight: ${({ weight }) => weight || 'regular'};
  color: ${({ color }) => (color !== undefined ? (theme.colors as Colors)[color] : theme.colors.black)};
  margin: ${({ margin }) => margin || '0'};
`;

const StyledWrapper = styled.div`
  display: flex;
  gap: 15px;
  background-color: ${theme.colors.white};
  padding: 10px;
  border-radius: 5px;
  > div:first-child {
    display: flex;
    align-items: center;
    > span {
      border-radius: 5px;
    }
  }
  > div:last-child {
    width: 180px;
  }
  @media screen and (max-width: ${theme.breakpoints.md}) {
    display: flex;
  }
`;

export default function MapMarker({
  space,
  location,
  spaceTypes,
}: {
  space: Space;
  location: Location;
  spaceTypes?: SpaceType[] | undefined;
}) {
  const referencePrice = space ? getSpaceReferencePrice(space, spaceTypes) : null;

  return (
    <StyledWrapper>
      <div>
        <Image
          src={space.spaceFiles.images ? space.spaceFiles.images[0].url : '/images/placeholder.png'}
          width={100}
          height={100}
          objectFit='cover'
          layout='fixed'
        />
      </div>
      <div>
        <StyledText size='16px' color='darkBlue' weight='700'>
          {space.name}
        </StyledText>
        <StyledText size='14px' color='blue'>
          {location.name}
        </StyledText>
        {referencePrice?.show && (
          <StyledText size='12px'>
            {referencePrice.cost} {referencePrice.priceText}
          </StyledText>
        )}
        {space && showPeopleCapacity(space, spaceTypes) && (
          <StyledText size='12px' color='orange'>
            {pluralize(space.peopleCapacity, 'persona', true)}
          </StyledText>
        )}
      </div>
    </StyledWrapper>
  );
}
