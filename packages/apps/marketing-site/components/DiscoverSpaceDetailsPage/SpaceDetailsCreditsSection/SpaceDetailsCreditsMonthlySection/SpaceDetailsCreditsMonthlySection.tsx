import { addPeriods, calculateDiscount, pluralize, Space } from '@wimet/apps-shared';
import { Fragment } from 'react';
import styled from 'styled-components';
import Text from '../../../UI/Text';

const StyledWrapper = styled.div`
  display: flex;
  column-gap: 60px;
  margin-top: 36px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
  }
`;

const StyledInnerWrapper = styled.div`
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    gap: 20px;
    margin-bottom: 32px;
  }
`;

const StyledItemWrapper = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  flex-grow: 1;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 130px;
  }
`;

const StyledText = styled(Text)`
  > b {
    font-weight: ${({ theme }) => theme.fontWeight[2]};
  }
`;

const StyledDiscountText = styled(Text)`
  color: ${({ theme }) => theme.colors.sky};
`;

const StyledSeparator = styled.div`
  width: 1px;
  height: auto;
  background-color: ${({ theme }) => theme.colors.lightGray};
  flex-shrink: 0;
`;

type Props = {
  prices?: Space['monthly'];
};

export default function SpaceDetailsCreditsMonthlySection({ prices }: Props) {
  const handleMonthlyPrices = (discount: Space['monthly']['spaceDiscounts'][number]) => {
    const percentage = Number(discount.spaceDiscountMonthlySpace.percentage);
    const parsedDiscount = Number(calculateDiscount(prices?.price || 0, discount.monthsAmount, percentage));
    return addPeriods(parsedDiscount);
  };

  return (
    <StyledWrapper>
      <StyledInnerWrapper>
        <StyledItemWrapper>
          <StyledText variant='large'>
            <b>${addPeriods(Number(prices?.price))}</b> / mes
          </StyledText>
        </StyledItemWrapper>
        {prices?.spaceDiscounts
          .sort((a, b) => a.monthsAmount - b.monthsAmount)
          .map((discount, i) => (
            <Fragment key={discount.id}>
              {!(i % 2) && <StyledSeparator />}
              <StyledItemWrapper>
                <StyledText variant='large'>
                  <b>${handleMonthlyPrices(discount)}</b> / {discount.monthsAmount} meses
                </StyledText>
                <StyledDiscountText variant='large'>
                  -{Number(discount.spaceDiscountMonthlySpace.percentage) * 100}%
                </StyledDiscountText>
              </StyledItemWrapper>
            </Fragment>
          ))}
      </StyledInnerWrapper>
      {!!prices?.spaceDeposits.length && (
        <StyledText variant='large'>
          <b>Depósito: {pluralize(prices?.spaceDeposits[0]?.monthsAmount, 'mes', true)}</b>
        </StyledText>
      )}
    </StyledWrapper>
  );
}
