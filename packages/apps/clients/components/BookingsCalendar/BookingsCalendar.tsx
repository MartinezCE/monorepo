import { DatePicker } from '@wimet/apps-shared';
import { max, min } from 'date-fns';
import styled from 'styled-components';

const StyledDatePicker = styled(DatePicker)`
  min-width: 421px !important;
  min-height: 396px;
  padding: 40px;
  box-shadow: 0px 20px 50px rgba(44, 48, 56, 0.12);
  & .DatePickerHeader__StyledWrapper-sc-mlpm3i-0 {
    color: ${({ theme: { colors } }) => colors.blue};
    > button > svg {
      color: ${({ theme: { colors } }) => colors.blue};
    }
  }

  & .react-datepicker__day-name {
    color: ${({ theme: { colors } }) => colors.darkBlue};
  }

  & .fullDay {
    background-color: ${({ theme: { colors } }) => colors.orange};
    border-radius: 50%;
  }

  & .midDay {
    background: linear-gradient(
      90deg,
      ${({ theme: { colors } }) => colors.orange} 50%,
      ${({ theme: { colors } }) => colors.lightOrange} 50%
    );
    border-radius: 50%;
  }

  & .other {
    background-color: ${({ theme: { colors } }) => colors.lightOrange};
    border-radius: 50%;
  }

  & .notSelected {
    background-color: ${({ theme: { colors } }) => colors.white};
  }
`;

type BookingDates = {
  date: Date;
  type: number;
};

export default function BookingsCalendar({ dates }: { dates: BookingDates[] }) {
  const handledDates = dates.map(item => item.date);
  const getDayClassName = (date: Date) => {
    const selected = dates.find(
      item =>
        item.date.getDate() === date.getDate() &&
        item.date.getMonth() === date.getMonth() &&
        item.date.getFullYear() === date.getFullYear()
    );
    if (selected) {
      switch (selected.type) {
        case 1:
          return 'fullDay';
        case 2:
          return 'midDay';
        case 3:
          return 'other';
        default:
          return '';
      }
    }

    return 'notSelected';
  };
  return (
    <StyledDatePicker
      onChange={() => {}}
      dayClassName={getDayClassName}
      startDate={min(handledDates)}
      endDate={max(handledDates)}
    />
  );
}
