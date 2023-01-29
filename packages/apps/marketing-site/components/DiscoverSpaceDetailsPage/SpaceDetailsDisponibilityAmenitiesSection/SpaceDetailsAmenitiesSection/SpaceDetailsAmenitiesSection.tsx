/* eslint-disable @next/next/no-img-element */
import { AmenityButton, Button, images, Amenity } from '@wimet/apps-shared';
import { useState } from 'react';
import styled, { css } from 'styled-components';

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  column-gap: 18px;
  row-gap: 52px;
  margin-top: 40px;
  justify-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
`;

const StyledAmenityButton = styled(AmenityButton)`
  > button {
    background-color: ${({ theme }) => theme.colors.extraLightBlue};
    padding: 10px;
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes[2]};
    line-height: ${({ theme }) => theme.lineHeights[1]};
  }
`;

type StyledButtonProps = {
  isActive?: boolean;
};

const StyledButton = styled(Button)<StyledButtonProps>`
  margin-top: 32px;
  width: fit-content;

  > svg {
    transition: transform 0.3s ease-in-out;

    ${({ isActive }) =>
      isActive &&
      css`
        transform: rotateZ(180deg);
      `}
  }
`;

type Props = {
  amenities?: Amenity[];
  maxAmenities?: number;
  className?: string;
};

export default function SpaceDetailsAmenitiesSection({ amenities, maxAmenities = 12, className }: Props) {
  const [showMoreAmenities, setShowMoreAmenities] = useState(false);

  return (
    <>
      <StyledWrapper className={className}>
        {amenities?.slice(0, !showMoreAmenities ? maxAmenities : undefined)?.map(amenity => (
          <StyledAmenityButton
            key={amenity.id}
            icon={
              amenity.isDefault ? (
                <img
                  src={`https://wimet-prod.s3.us-west-2.amazonaws.com/amenities/${amenity.fileName}`}
                  alt={amenity.name}
                />
              ) : (
                <images.Star />
              )
            }
            label={amenity.name}
          />
        ))}
      </StyledWrapper>
      {amenities && amenities.length > maxAmenities && (
        <StyledButton
          variant='secondary'
          trailingIcon={<images.TinyChevronDown />}
          onClick={() => setShowMoreAmenities(!showMoreAmenities)}
          isActive={showMoreAmenities}
          noBackground>
          {showMoreAmenities ? 'Ver menos' : 'Ver más'}
        </StyledButton>
      )}
    </>
  );
}
