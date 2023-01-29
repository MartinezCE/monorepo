import { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import es from 'date-fns/locale/es';
import format from 'date-fns/format';
import styled from 'styled-components';
import Button from '../../Button';
import { images } from '../../../assets';

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 34px;
`;
const StyledMonthName = styled.div`
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  text-transform: capitalize;
`;

const StyledIconLeft = styled(images.ChevronLeft)`
  transform: translateX(-7px);
`;
const StyledIconRight = styled(images.LightChevronRight)`
  transform: translateX(7px);
`;

const StyledButton = styled(Button)`
  &:disabled {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.gray};
  }
  &:hover:disabled {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const DatePickerHeader = (props: ReactDatePickerCustomHeaderProps) => {
  const { date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled } = props;
  return (
    <StyledWrapper>
      <StyledButton variant='transparent' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
        <StyledIconLeft />
      </StyledButton>
      <StyledMonthName>{format(date, 'MMMM yyyy', { locale: es })}</StyledMonthName>
      <StyledButton variant='transparent' onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
        <StyledIconRight />
      </StyledButton>
    </StyledWrapper>
  );
};

export default DatePickerHeader;
