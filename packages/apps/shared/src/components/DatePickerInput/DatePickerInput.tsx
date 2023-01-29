import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { getIn, useFormikContext } from 'formik';
import styled, { css } from 'styled-components';
import { images } from '../../assets';
import { useIsOutside } from '../../hooks';
import DatePicker from '../DatePicker/DatePicker';
import Input from '../Input';

const StyledStyledFromDateWrapper = styled.div`
  position: relative;
`;

const StyledFromDateInput = styled(Input)<{ disabled?: boolean }>`
  ${({ disabled }) =>
    !disabled &&
    css`
      cursor: pointer !important;
      & input {
        cursor: pointer !important;
      }
    `}
`;

const StyledTrailingIconWrapper = styled.div`
  margin: 14px 24px 14px 24px;
`;
const StyledTrailingIcon = styled(images.Calendar)`
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledDatePickerCard = styled.div`
  padding: 35px 32px 35px 32px;
  margin-top: 14px;
  border-radius: 8px;
  box-shadow: 0px 20px 40px rgba(44, 48, 56, 0.15);
  background-color: white;
  position: absolute;
  z-index: 2;
`;

type Props = {
  name: string;
  filterDate?: (date: Date) => boolean;
  onChange?: (date: Date) => void;
  minDate?: Date;
  label?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
};

const DatePickerInput = ({
  name,
  filterDate,
  onChange,
  minDate,
  label,
  className,
  placeholder = 'Seleccione una fecha',
  disabled,
}: Props) => {
  const formik = useFormikContext();
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLInputElement>(null);
  const { isOutside: isOutsideCalendar } = useIsOutside({ ref: calendarWrapperRef });
  const { isOutside: isOutsideInput } = useIsOutside({ ref: inputWrapperRef });

  useEffect(() => {
    if (isOutsideCalendar && isOutsideInput) {
      setShowCalendar(false);
    }
  }, [isOutsideCalendar, isOutsideInput]);

  const handleOnChange = (date: Date) => {
    formik.setFieldValue(name, date);
    setShowCalendar(false);
    if (onChange) {
      onChange(date);
    }
  };

  const formikValue = getIn(formik.values, name);

  return (
    <StyledStyledFromDateWrapper className={className}>
      <StyledFromDateInput
        placeholder={placeholder}
        ref={inputWrapperRef}
        onClick={() => setShowCalendar(true)}
        label={label}
        value={formikValue ? format(formikValue, 'dd/MM/yyyy') : ''}
        trailingAdornment={
          !disabled ? (
            <StyledTrailingIconWrapper>
              <StyledTrailingIcon />
            </StyledTrailingIconWrapper>
          ) : null
        }
        name={name}
        disabled={disabled}
        readOnly
      />
      {showCalendar && (
        <StyledDatePickerCard ref={calendarWrapperRef}>
          <DatePicker
            selected={formik.values[name]}
            filterDate={filterDate}
            highlightedDates={formik.values[name] ? [formik.values[name]] : []}
            onChange={handleOnChange}
            variant='small'
            minDate={minDate || new Date()}
          />
        </StyledDatePickerCard>
      )}
    </StyledStyledFromDateWrapper>
  );
};

export default DatePickerInput;
