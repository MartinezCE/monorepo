import React from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import styled from 'styled-components';
import { addPeriods, Space } from '@wimet/apps-shared';
import SpaceDetailsReserveSidebarBase from '../../SpaceDetailsReserveSidebarBase';
import { Reserve } from '../SpaceDetailsMonthlyCalendar/SpaceDetailsMonthlyCalendar';

const StyledResumeWrapper = styled.div`
  margin-top: 48px;
  display: flex;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    > div > div {
      font-size: 13px;
    }
  }
`;

const StyledDateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  &:not(:last-child) {
    margin-right: 48px;
  }
`;
const StyledLabel = styled.div`
  font-size: 16px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledDateText = styled.div`
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.blue};
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
`;
const StyledTotalWrapper = styled.div`
  margin-top: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.extraLightGray};
  padding: 24px;
  border-radius: 8px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    > div:first-child {
      font-size: 16px;
      > div {
        font-size: 14px;
      }
    }
  }
`;
const StyledTotalLabel = styled.div`
  display: flex;
  align-items: baseline;
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.orange};
`;
const StyledDiscountInfo = styled.div`
  font-weight: 200;
  margin-left: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.darkGray};
`;
const StyledTotalAmountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    > div:last-child {
      font-size: 16px;
    }
  }
`;
const StyledTotalAmountDiscount = styled.div`
  font-size: 14px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.gray};
  text-decoration: line-through;
`;
const StyledTotalAmount = styled.div`
  font-weight: 500;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.orange};
`;

type Props = {
  isLoading?: boolean;
  onClickClose: () => void;
  onConfirmReservation: () => void;
  reservation: Reserve;
  space: Partial<Space>;
};

const SpaceDetailsMonthlySidebar = ({ onClickClose, reservation, space, onConfirmReservation, isLoading }: Props) => {
  const discountPercent = reservation.discountType ? reservation.discountType : 0;
  const totalAmount = (space.monthly?.price || 0) * (reservation?.selectedMonthOption || 0);
  const price = totalAmount - totalAmount * (discountPercent / 100);

  return (
    <SpaceDetailsReserveSidebarBase
      onClickClose={onClickClose}
      space={space}
      onConfirmReservation={onConfirmReservation}
      isLoading={isLoading}>
      <StyledResumeWrapper>
        <StyledDateWrapper>
          <StyledLabel>Desde</StyledLabel>
          {reservation.startDate && (
            <StyledDateText>{format(reservation.startDate, 'EEEE dd/MM/yyyy', { locale: es })}</StyledDateText>
          )}
        </StyledDateWrapper>
        <StyledDateWrapper>
          <StyledLabel>Hasta</StyledLabel>
          {reservation.untilDate && (
            <StyledDateText>{format(reservation.untilDate, 'EEEE dd/MM/yyyy', { locale: es })}</StyledDateText>
          )}
        </StyledDateWrapper>
      </StyledResumeWrapper>
      <StyledTotalWrapper>
        <StyledTotalLabel>
          Total
          {!!reservation.discountType && (
            <StyledDiscountInfo>{`${reservation.selectedMonthOption} meses -${reservation.discountType}%`}</StyledDiscountInfo>
          )}
        </StyledTotalLabel>
        <StyledTotalAmountWrapper>
          {!!reservation.discountType && (
            <StyledTotalAmountDiscount>{`$${addPeriods(totalAmount)}`}</StyledTotalAmountDiscount>
          )}
          <StyledTotalAmount>${price}</StyledTotalAmount>
        </StyledTotalAmountWrapper>
      </StyledTotalWrapper>
    </SpaceDetailsReserveSidebarBase>
  );
};

export default SpaceDetailsMonthlySidebar;
