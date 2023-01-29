import { PlanRenovation, PlanStatus, useGetMe } from '@wimet/apps-shared';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import styled from 'styled-components';
import { disabledConfig } from '../CreatedPlanCardHeader/CreatedPlanCardHeader';

const StyledDatesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
`;

const StyledDateWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledDateLabel = styled.div`
  font-size: 12px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.darkGray};
  ${disabledConfig};
`;
const StyledDateValue = styled.div`
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
  ${disabledConfig};
`;

type Props = {
  status: PlanStatus;
  start: Date;
  renovation: PlanRenovation;
};

const CreatedPlanCardDates = ({ status, start, renovation }: Props) => {
  const { data: userData } = useGetMe();

  return (
    <StyledDatesWrapper>
      <StyledDateWrapper>
        <StyledDateLabel status={status}>Inicio</StyledDateLabel>
        <StyledDateValue status={status}>{format(start, 'dd/MM/yyyy')}</StyledDateValue>
      </StyledDateWrapper>
      <StyledDateWrapper>
        {renovation && (
          <>
            <StyledDateLabel status={status}>Renovación</StyledDateLabel>
            <StyledDateValue status={status}>
              {formatInTimeZone(renovation.endDate, String(userData?.companies[0].tz), 'dd/MM/yyyy')}
            </StyledDateValue>
          </>
        )}
      </StyledDateWrapper>
    </StyledDatesWrapper>
  );
};

export default CreatedPlanCardDates;
