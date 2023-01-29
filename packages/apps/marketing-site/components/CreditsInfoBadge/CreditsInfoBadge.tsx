import { Badge, pluralize, Space, SpaceReservationType, Tag, useGetAllSpacesTypes } from '@wimet/apps-shared';
import React from 'react';
import styled from 'styled-components';
import { getSpaceReferencePrice, showPeopleCapacity } from '../../utils/space';

const StyledWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
    gap: 20px;
    > div {
      margin-left: 0;
    }
  }
`;

const StyledBadge = styled(Badge)`
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: ${({ theme }) => theme.fontWeight[2]};
  background-color: ${({ theme }) => theme.colors.lightOrange};
  padding: 6px 8px;
  font-size: ${({ theme }) => theme.fontSizes[4]};
  line-height: ${({ theme }) => theme.lineHeights[2]};
`;

const StyledCreditsText = styled.h6`
  color: ${({ theme }) => theme.colors.blue};
  margin-right: 8px;
`;

const StyledCreditsPrefix = styled.span`
  color: ${({ theme }) => theme.colors.blue};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  font-size: 20px;
  line-height: 28px;
`;

const StyledPriceContainer = styled.div`
  margin-left: 40px;
  display: flex;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
  }
`;

const StyledMonthTagContainer = styled.div`
  margin-left: 24.5px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0px;
  }
`;

type Props = {
  space: Partial<Space>;
  onClickDiscounts?: () => void;
};

const CreditsInfoBadge = ({ space, onClickDiscounts }: Props) => {
  const isHourly = space.spaceReservationType?.value === SpaceReservationType.HOURLY;
  const hasDiscount = !!space.monthly?.spaceDiscounts.length;
  const { data } = useGetAllSpacesTypes();

  const referencePrice = getSpaceReferencePrice(space as Space, data);

  return (
    <StyledWrapper>
      {showPeopleCapacity(space, data) && (
        <StyledBadge>{pluralize(space.peopleCapacity || 0, 'persona', true)}</StyledBadge>
      )}
      {referencePrice.show && (
        <StyledPriceContainer>
          <StyledCreditsText>{referencePrice.cost}</StyledCreditsText>
          <StyledCreditsPrefix>{referencePrice.priceText}</StyledCreditsPrefix>
          {!isHourly && hasDiscount && (
            <StyledMonthTagContainer>
              <Tag onClick={onClickDiscounts}>+ descuento</Tag>
            </StyledMonthTagContainer>
          )}
        </StyledPriceContainer>
      )}
    </StyledWrapper>
  );
};

export default CreditsInfoBadge;
