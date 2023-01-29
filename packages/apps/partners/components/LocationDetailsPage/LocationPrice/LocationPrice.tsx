import React from 'react';
import styled from 'styled-components';
import { addPeriods, Label } from '@wimet/apps-shared';

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledSecondLabel = styled(Label)`
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  margin-top: 4px;
`;

type Props = {
  price?: number;
  billingPeriod?: string;
  minTerm?: number;
};

const LocationPrice = ({ price, billingPeriod, minTerm }: Props) => (
  <StyledTextWrapper>
    {price && <Label text={`$${addPeriods(price)} / ${billingPeriod}`} variant='tertiary' lowercase />}
    {minTerm && billingPeriod && (
      <StyledSecondLabel text={`${minTerm} ${billingPeriod} mínimo`} variant='currentColor' lowercase />
    )}
  </StyledTextWrapper>
);

export default LocationPrice;
