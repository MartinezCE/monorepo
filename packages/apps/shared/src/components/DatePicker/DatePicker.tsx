import styled, { css } from 'styled-components';
import BaseDatePicker from './BaseDatePicker';
import DatePickerHeader from './DatePickerHeader';

type StyledDatePickerProps = {
  variant?: 'large' | 'small';
};

const StyledDatePicker = styled(BaseDatePicker)<StyledDatePickerProps>`
  border: none;
  &.react-datepicker {
    width: 100%;
    & .react-datepicker__month-container {
      width: 100%;
    }
    & .react-datepicker__header {
      background-color: transparent;
      border-bottom: none;
      padding: 0;
      margin-bottom: 27px;

      & .react-datepicker__day-names {
        display: grid;
        grid-template-columns: repeat(7, 1fr);

        & .react-datepicker__day-name {
          font-size: 16px;
          font-weight: 500;
          width: 40px;
          margin: 0;
          text-transform: capitalize;
        }
      }
    }

    & .react-datepicker__month {
      margin: 0;
      margin-left: -12px;
      margin-right: -24px;
    }

    & .react-datepicker__week {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      margin-bottom: 7px;
      &:last-child {
        margin-bottom: 0;
      }
      & .react-datepicker__day {
        color: ${({ theme }) => theme.colors.darkGray};
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          border-radius: 50%;
        }
      }

      & .react-datepicker__day--selected,
      .react-datepicker__day--keyboard-selected {
        background-color: transparent;
        color: ${({ theme }) => theme.colors.darkGray};
      }

      & .react-datepicker__day--keyboard-selected:hover {
        background-color: #f0f0f0;
        color: ${({ theme }) => theme.colors.darkGray};

        &.react-datepicker__day--disabled {
          background-color: transparent;
        }
      }

      & .react-datepicker__day--highlighted {
        border-radius: 50%;
        background-color: ${({ theme }) => theme.colors.orange};
        color: ${({ theme }) => theme.colors.white};
        font-weight: 500;
      }

      & .react-datepicker__day--outside-month,
      .react-datepicker__day--excluded {
        color: ${({ theme }) => theme.colors.gray};
      }

      & .react-datepicker__day--outside-month.react-datepicker__day--highlighted {
        color: ${({ theme }) => theme.colors.white};
        background-color: ${({ theme }) => theme.colors.orangeOpacity25};
      }

      & .react-datepicker__day--disabled {
        color: ${({ theme }) => theme.colors.gray};
      }

      & .react-datepicker__day--today {
        font-weight: 500;
        &.react-datepicker__day--disabled:hover {
          color: #999999;
        }
      }
    }
  }
  width: 100%;
  height: 100%;
  ${({ variant }) => {
    switch (variant) {
      case 'large':
        return css`
          & .react-datepicker__day-name {
            height: 40px;
            color: ${({ theme }) => theme.colors.darkGray};
          }

          & .react-datepicker__day-names {
            margin-left: -12px;
            margin-right: -24px;
          }
          & .react-datepicker__month {
            margin: 0;
            margin-left: -12px;
            margin-right: -24px;
          }
          & .react-datepicker__day {
            height: 40px;
            width: 40px;
            font-weight: 200;
            font-size: 16px;
          }
        `;
      case 'small':
        return css`
          & .react-datepicker__day-name {
            height: initial !important;
            line-height: initial !important;
            color: ${({ theme }) => theme.colors.darkBlue} !important;
          }

          & .react-datepicker__day-names,
          .react-datepicker__month {
            margin-left: 0 !important;
            margin-right: 0 !important;
            justify-content: center;
          }
          & .react-datepicker__day {
            height: 36px !important;
            width: 36px !important;
            font-weight: 500 !important;
            font-size: 14px !important;
          }
          & .react-datepicker__header--custom {
            color: ${({ theme }) => theme.colors.blue};
            margin-bottom: 20px !important;
            & button > svg {
              color: ${({ theme }) => theme.colors.blue};
            }
          }
        `;
      default:
        return '';
    }
  }}
`;

type Props = {
  className?: string;
  selected?: Date;
  onChange?: (date: Date) => void;
  excludedDates?: Date[];
  highlightedDates?: Date[];
  variant?: 'large' | 'small';
  onMonthChange?: (date: Date) => void;
  filterDate?: (date: Date) => boolean;
  minDate?: Date;
  dayClassName?: (date: Date) => string;
  startDate?: Date;
  endDate?: Date;
};

const DatePicker = (props: Props) => {
  const {
    selected,
    onChange,
    className,
    filterDate,
    excludedDates,
    highlightedDates,
    onMonthChange,
    variant = 'large',
    minDate,
    dayClassName,
    startDate,
    endDate,
  } = props;
  return (
    <StyledDatePicker
      onMonthChange={onMonthChange}
      variant={variant}
      filterDate={filterDate}
      selected={selected}
      onChange={onChange}
      className={className}
      excludedDates={excludedDates}
      highlightedDates={highlightedDates}
      customHeader={DatePickerHeader}
      minDate={minDate}
      dayClassName={dayClassName}
      startDate={startDate}
      endDate={endDate}
      {...props}
    />
  );
};

export default DatePicker;
