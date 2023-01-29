import React from 'react';
import { Button, DatePicker, images, Popup } from '@wimet/apps-shared';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { BookingInitialValues } from '../../../../pages/spaces/office';

const StyledDatesPopup = styled.div`
  z-index: 1;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0px 20px 40px rgba(44, 48, 56, 0.15);
  background-color: white;
`;

const StyledCalendarIcon = styled(images.Calendar)`
  transform: scale(0.82);
`;

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: ${({ theme }) => theme.fontSizes[4]};
  line-height: ${({ theme }) => theme.lineHeights[2]};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  column-gap: 16px;
`;

const StyledDatePicker = styled(DatePicker)`
  & .react-datepicker__header {
    margin-bottom: 6px !important;
    & > div {
      color: ${({ theme }) => theme.colors.blue};
      margin-bottom: 22px;
      & button {
        color: ${({ theme }) => theme.colors.blue};
      }
    }
    & .react-datepicker__day-names {
      margin: 0;
      column-gap: 7.5px;
    }
    & .react-datepicker__day-name {
      color: ${({ theme }) => theme.colors.darkBlue};
      font-size: 14px !important;
    }
  }

  & .react-datepicker__week {
    column-gap: 7.5px;
    margin-bottom: 6px !important;
    & :last-child {
      margin-bottom: 0 !important;
    }
  }

  & .react-datepicker__day {
    font-size: 14px !important;
    font-weight: 500 !important;
    &.react-datepicker__day--outside-month {
      font-weight: 200 !important;
    }
  }

  & .react-datepicker__month {
    margin: 0 !important;
  }
`;

const DatePickerPopup = () => {
  const { setFieldValue, values } = useFormikContext<BookingInitialValues>();

  const handleDatePickerChange = (selectedDate: Date) => setFieldValue('selectedDate', selectedDate);

  return (
    <Popup
      container={
        <StyledButton noBackground trailingIcon={<StyledCalendarIcon />}>
          Fechas
        </StyledButton>
      }>
      {setShowPopup => (
        <StyledDatesPopup>
          <StyledDatePicker
            onChange={date => {
              handleDatePickerChange(date);
              setShowPopup(false);
            }}
            selected={values.selectedDate}
            highlightedDates={[values.selectedDate]}
          />
        </StyledDatesPopup>
      )}
    </Popup>
  );
};

export default DatePickerPopup;
