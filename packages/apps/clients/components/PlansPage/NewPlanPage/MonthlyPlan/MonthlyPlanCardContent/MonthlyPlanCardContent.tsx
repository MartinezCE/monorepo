import React from 'react';
import { lastDayOfMonth, format } from 'date-fns';
import { useFormikContext } from 'formik';
import styled, { css } from 'styled-components';
import { Credit } from '@wimet/apps-shared';
import { initialValues } from '../../../../../pages/pass/plans/new/[planType]';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledText = styled.p`
  margin-bottom: 32px;
  & span {
    font-weight: 500;
  }
`;

const grid = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const StyledPlanDescription = styled.div`
  ${grid}
`;

const StyledTitle = styled.div`
  font-size: 16px;
  font-weight: 200;
`;
const StyledValue = styled.div`
  display: flex;
  justify-content: end;
  color: ${({ theme }) => theme.colors.darkBlue};
  font-size: 16px;
  font-weight: 200;
  align-items: baseline;
`;
const StyledHighlight = styled.div`
  font-weight: 500;
`;

const StyledTotalArea = styled.div`
  margin-top: 32px;
  ${grid}
  background-color: ${({ theme }) => theme.colors.extraLightGray};
  padding: 12px;
  border-radius: 4px;
`;

const StyledTitleTotal = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.orange};
`;
const StyledValueTotal = styled.div`
  display: flex;
  justify-content: end;
  color: ${({ theme }) => theme.colors.orange};
  font-size: 16px;
  font-weight: 500;
`;

type Props = {
  creditsPrice?: Credit;
};

const MonthlyPlanCardContent = ({ creditsPrice }: Props) => {
  const { values } = useFormikContext<typeof initialValues>();
  const total = Number(creditsPrice?.value) * values.credits || 0;
  return (
    <StyledWrapper>
      <StyledText>
        El plan se cobrará el día <span>{format(lastDayOfMonth(values.startDate), 'dd/MM/yyyy')}</span> pudiendo
        acumular el saldo de créditos del mes anterior durante un período de 3 meses.
      </StyledText>
      <StyledPlanDescription>
        <StyledTitle>Plan</StyledTitle>
        <StyledValue>
          <StyledHighlight>{`${creditsPrice?.currency.value || ''} ${total} `}</StyledHighlight> /mes
        </StyledValue>

        <StyledTitle>Impuestos</StyledTitle>
        <StyledValue>ARS 0</StyledValue>
      </StyledPlanDescription>
      <StyledTotalArea>
        <StyledTitleTotal>Total</StyledTitleTotal>
        <StyledValueTotal>{`${creditsPrice?.currency.value || ''} ${total}`}</StyledValueTotal>
      </StyledTotalArea>
    </StyledWrapper>
  );
};

export default MonthlyPlanCardContent;
