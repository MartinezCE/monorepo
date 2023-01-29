/* eslint-disable consistent-return */
import { RadioButton, DatePickerInput, useGetMe, UserStatus, Space, lockScroll, letScroll } from '@wimet/apps-shared';
import { addMonths, format } from 'date-fns';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';
import useCreateSpaceReservation from '../../../../hooks/api/useCreateSpaceReservation';
import SpaceDetailsReserveCard from '../../SpaceDetailsReserveCard';
import SpaceDetailsMonthlySidebar from '../SpaceDetailsMonthlySidebar';

const StyledFromDateInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledOptionsWrapper = styled.div`
  margin-top: 41px;
  margin-bottom: 20px;
  & > * {
    margin-bottom: 21px;
  }
`;

const StyledRadioButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledRadioButton = styled(RadioButton)`
  & input {
    &:checked {
      & + span {
        font-weight: 500;
        font-size: 14px;
      }
    }
    & + span {
      font-weight: 200;
      font-size: 14px;
    }
  }
`;

const StyledDiscountPercentLabel = styled.span`
  color: ${({ theme }) => theme.colors.sky};
  font-size: 16px;
  font-weight: 200;
`;

const StyledSelectedDateText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.darkBlue};
  margin-bottom: 44px;
`;

const StyledDatePickerInput = styled(DatePickerInput)`
  & label {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.darkGray};
  }
`;

const StyledMainContent = styled.div<{ hide: boolean }>`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ hide }) => (hide ? 'none' : 'block')};
    height: ${({ hide }) => hide && 0};
  }
`;

const initialValues = { fromDate: new Date(), monthsQuantity: 0, discountType: undefined };
const BREAKPOINT_WIDTH = 768;

export type Reserve = {
  selectedMonthOption: number | null;
  startDate: Date | null;
  untilDate: Date | null;
  discountType?: number | null;
  discountValue?: string | null;
};

type Props = {
  space: Partial<Space>;
  filterDate: (date: Date) => boolean;
  minMonthsAmount: number;
  maxMonthsAmount: number;
  discounts?: { [id: number]: number }[];
  onConfirmReservation?: () => void;
};

const SpaceDetailsMonthlyCalendar = ({
  space,
  filterDate,
  minMonthsAmount,
  maxMonthsAmount,
  discounts = [],
  onConfirmReservation,
}: Props) => {
  const { query, push } = useRouter();
  const { data: user } = useGetMe();
  const { spaceId } = query as { spaceId: string };

  const [showSidebar, setShowSidebar] = useState(false);
  const { mutateAsync: createReservation, isLoading: isCreatingReserve } = useCreateSpaceReservation(spaceId);

  const formik = useFormik({
    initialValues,
    onSubmit: ({ fromDate, monthsQuantity }) => createReservation({ spaceId, monthly: { fromDate, monthsQuantity } }),
  });
  const { fromDate, monthsQuantity } = formik.values;

  const month3Discount = discounts.find(item => item[3]);
  const month6Discount = discounts.find(item => item[6]);
  const month12Discount = discounts.find(item => item[12]);

  const handleOnChangeMonthQuantity = (e: FormEvent<HTMLInputElement>) => {
    const value = parseInt(e.currentTarget.value, 10);
    formik.setFieldValue('monthsQuantity', value);

    const monthDiscount = discounts.find(item => item[value]);
    formik.setFieldValue('discountType', monthDiscount?.[value]);
  };

  const handleOnConfirmReservation = async () => {
    if (user?.status !== UserStatus.APPROVED) return push(user?.profileUrl || '/');
    await formik.submitForm();
    formik.setValues(initialValues);
    setShowSidebar(false);
    onConfirmReservation?.();
  };

  return (
    <SpaceDetailsReserveCard
      onClickReserve={() => {
        // eslint-disable-next-line no-restricted-globals
        const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
        if (width < BREAKPOINT_WIDTH) {
          window.scrollTo(0, 0);
          lockScroll();
        }
        setShowSidebar(true);
      }}
      disableButton={!fromDate || !monthsQuantity}
      isLoading={isCreatingReserve}>
      <StyledFromDateInputWrapper>
        <FormikProvider value={formik}>
          <StyledMainContent hide={showSidebar}>
            <StyledDatePickerInput name='fromDate' filterDate={filterDate} label='Desde' />
            <StyledOptionsWrapper>
              {minMonthsAmount <= 1 && maxMonthsAmount >= 1 && (
                <StyledRadioButtonWrapper>
                  <StyledRadioButton
                    label='1 mes'
                    name='monthsQuantity'
                    value={1}
                    onChange={handleOnChangeMonthQuantity}
                  />
                </StyledRadioButtonWrapper>
              )}
              {minMonthsAmount <= 3 && maxMonthsAmount >= 3 && (
                <StyledRadioButtonWrapper>
                  <StyledRadioButton
                    label='3 meses'
                    name='monthsQuantity'
                    value={3}
                    onChange={handleOnChangeMonthQuantity}
                  />
                  {discounts && month3Discount && (
                    <StyledDiscountPercentLabel>-{month3Discount[3]}%</StyledDiscountPercentLabel>
                  )}
                </StyledRadioButtonWrapper>
              )}
              {minMonthsAmount <= 6 && maxMonthsAmount >= 6 && (
                <StyledRadioButtonWrapper>
                  <StyledRadioButton
                    label='6 meses'
                    name='monthsQuantity'
                    value={6}
                    onChange={handleOnChangeMonthQuantity}
                  />
                  {discounts && month6Discount && (
                    <StyledDiscountPercentLabel>-{month6Discount[6]}%</StyledDiscountPercentLabel>
                  )}
                </StyledRadioButtonWrapper>
              )}
              {minMonthsAmount <= 12 && maxMonthsAmount >= 12 && (
                <StyledRadioButtonWrapper>
                  <StyledRadioButton
                    label='12 meses'
                    name='monthsQuantity'
                    value={12}
                    onChange={handleOnChangeMonthQuantity}
                  />
                  {discounts && month12Discount && (
                    <StyledDiscountPercentLabel>-{month12Discount[12]}%</StyledDiscountPercentLabel>
                  )}
                </StyledRadioButtonWrapper>
              )}
            </StyledOptionsWrapper>
            {fromDate && !!monthsQuantity && (
              <StyledSelectedDateText>
                {`Hasta ${format(addMonths(fromDate, monthsQuantity), 'dd/MM/yyyy')}`}
              </StyledSelectedDateText>
            )}
          </StyledMainContent>
          {showSidebar && (
            <SpaceDetailsMonthlySidebar
              space={space}
              onConfirmReservation={handleOnConfirmReservation}
              onClickClose={() => {
                letScroll();
                setShowSidebar(false);
              }}
              reservation={{
                selectedMonthOption: monthsQuantity,
                startDate: fromDate,
                untilDate: addMonths(fromDate, monthsQuantity),
                discountType: formik.values.discountType,
              }}
              isLoading={isCreatingReserve}
            />
          )}
        </FormikProvider>
      </StyledFromDateInputWrapper>
    </SpaceDetailsReserveCard>
  );
};

export default SpaceDetailsMonthlyCalendar;
