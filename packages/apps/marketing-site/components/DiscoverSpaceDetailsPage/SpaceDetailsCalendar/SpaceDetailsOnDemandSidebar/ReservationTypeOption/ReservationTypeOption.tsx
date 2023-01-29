/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-return-assign */
import {
  pluralize,
  RadioButton,
  SpaceReservationHalfDayTypes,
  SpaceReservationHourlyTypes,
  Hourly,
  BreakpointBox,
} from '@wimet/apps-shared';
import es from 'date-fns/locale/es';
import { set, format } from 'date-fns';
import { useFormikContext } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { SpaceDetailsOnDemandCalendarInitialValues } from '../../SpaceDetailsOnDemandCalendar/SpaceDetailsOnDemandCalendar';
import TimePicker from './TimePicker';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  margin-bottom: 56px;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledDateLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.blue};
`;
const StyledCreditsLabel = styled.div`
  font-size: 16px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.orange};
`;

const StyledOptionsWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const StyledRadioButtonsWrapper = styled.div`
  display: flex;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

type StyledRadioButtonWrapperProps = {
  arrowPosition?: number;
  optionValue?: string;
  optionValueSelected?: string;
  showArrow?: boolean;
};

const StyledRadioButtonWrapper = styled.div<StyledRadioButtonWrapperProps>`
  position: relative;
  margin-right: 40px;
  &:after {
    content: '';
    visibility: ${({ optionValue, optionValueSelected, showArrow = true }) =>
      optionValue === optionValueSelected && showArrow ? 'visible' : 'hidden'};
    position: absolute;
    border-style: solid;
    border-width: 0 5px 5px;
    border-color: #ffffff transparent;
    display: block;
    width: 0;
    z-index: 1;
    top: 26px;
    left: ${({ arrowPosition }) => arrowPosition}px;
  }

  &:before {
    content: '';
    visibility: ${({ optionValue, optionValueSelected, showArrow = true }) =>
      optionValue === optionValueSelected && showArrow ? 'visible' : 'hidden'};
    position: absolute;
    border-style: solid;
    border-width: 0 5px 5px;
    border-color: #7f7f7f transparent;
    display: block;
    width: 0;
    z-index: 1;
    top: 26px;
    left: ${({ arrowPosition }) => arrowPosition}px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-right: 20px;
    &:after {
      left: 40px;
    }

    &:before {
      left: 40px;
    }
  }
`;

const StyledRadioButton = styled(RadioButton)`
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
  span {
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.darkGray} !important;
  }
`;

const StyledHalfDayRadioButton = styled(RadioButton)`
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
  span {
    font-weight: 200;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.darkGray} !important;
  }
`;

const StyledDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #7f7f7f;
  position: relative;
  margin-top: 10px;
  opacity: 0.5;
`;

const StyledOptionFieldsWrapper = styled.div`
  display: flex;
  margin-top: 24px;
`;

const StyledPerHourOptionFieldsWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledPerHourSeparatorWrapper = styled.div`
  margin-left: 16px;
  margin-right: 16px;
  display: flex;
  align-items: center;
`;

const StyledPerHourSeparator = styled.div`
  width: 8px;
  border: 0.5px solid ${({ theme }) => theme.colors.darkGray};
  border-top: none;
`;

const StyledPerHalfDayOptionFieldsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledBreakpointBox = styled(BreakpointBox)`
  flex-direction: column;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
  }
`;

type Props = {
  date: Date; // This prop should not be passed and hourly should be used instead
  name: string;
  reserveTypeSelected: SpaceReservationHourlyTypes;
  halfDayTypeSelected?: SpaceReservationHalfDayTypes;
  hourly?: Hourly;
  credits: number;
};

const ReservationTypeOption = ({ date, name, reserveTypeSelected, halfDayTypeSelected, hourly, credits }: Props) => {
  const [arrowPosition, setArrowPosition] = useState(0);

  const { setFieldValue, setFieldTouched } = useFormikContext<SpaceDetailsOnDemandCalendarInitialValues>();
  const radioRefs = useRef<{ [k in SpaceReservationHourlyTypes]: HTMLDivElement | null }>({
    [SpaceReservationHourlyTypes.PER_HOUR]: null,
    [SpaceReservationHourlyTypes.HALF_DAY]: null,
    [SpaceReservationHourlyTypes.DAYPASS]: null,
  });

  const handleArrowPosition = (selected?: SpaceReservationHourlyTypes) => {
    if (selected) {
      const ref = radioRefs.current[selected];
      if (!ref) return;

      const middlePosition = ref.getBoundingClientRect().width / 2;
      setArrowPosition(middlePosition);
    }
  };

  const nameField = (key: string) => `${name}.${key}`;

  const setInNameFieldValue = (key: string, value: unknown) => {
    const k = nameField(key);
    setFieldValue(k, value);
    setFieldTouched(k, true);
  };

  const handleReservePerHour = () => {
    const initialStartTime = set(new Date(date), { hours: 9, minutes: 0, seconds: 0 });
    const initialEndTime = set(new Date(date), { hours: 9 + (hourly?.minHoursAmount || 0), minutes: 0, seconds: 0 });
    setInNameFieldValue('type', SpaceReservationHourlyTypes.PER_HOUR);
    setInNameFieldValue('perHour.start', initialStartTime);
    setInNameFieldValue('perHour.end', initialEndTime);
    setInNameFieldValue('perHour._minHoursAmount', hourly?.minHoursAmount || 0);
  };

  const handleReservePerHalfDay = () => {
    setInNameFieldValue('type', SpaceReservationHourlyTypes.HALF_DAY);
    if (halfDayTypeSelected) return;
    setInNameFieldValue('halfDay', SpaceReservationHalfDayTypes.MORNING);
  };

  const PerHourForm = (reserveType: SpaceReservationHourlyTypes) =>
    reserveType === SpaceReservationHourlyTypes.PER_HOUR && (
      <>
        <StyledDivider />
        <StyledPerHourOptionFieldsWrapper>
          <TimePicker name={nameField('perHour.start')} />
          <StyledPerHourSeparatorWrapper>
            <StyledPerHourSeparator />
          </StyledPerHourSeparatorWrapper>
          <TimePicker name={nameField('perHour.end')} />
        </StyledPerHourOptionFieldsWrapper>
      </>
    );

  const HalfDayForm = (reserveType: SpaceReservationHourlyTypes) =>
    reserveType === SpaceReservationHourlyTypes.HALF_DAY && (
      <>
        <StyledDivider />
        <StyledPerHalfDayOptionFieldsWrapper>
          <StyledRadioButtonWrapper showArrow={false}>
            <StyledHalfDayRadioButton
              label='Mañana - Tarde'
              name={nameField('halfDayType')}
              onChange={() => setInNameFieldValue('halfDay', SpaceReservationHalfDayTypes.MORNING)}
              checked={halfDayTypeSelected === SpaceReservationHalfDayTypes.MORNING}
            />
          </StyledRadioButtonWrapper>
          <StyledRadioButtonWrapper showArrow={false}>
            <StyledHalfDayRadioButton
              label='Tarde - Noche'
              name={nameField('halfDayType')}
              onChange={() => setInNameFieldValue('halfDay', SpaceReservationHalfDayTypes.AFTERNOON)}
              checked={halfDayTypeSelected === SpaceReservationHalfDayTypes.AFTERNOON}
            />
          </StyledRadioButtonWrapper>
        </StyledPerHalfDayOptionFieldsWrapper>
      </>
    );

  useEffect(() => handleArrowPosition(reserveTypeSelected), [reserveTypeSelected]);
  useEffect(() => {
    if (reserveTypeSelected === SpaceReservationHourlyTypes.PER_HOUR) {
      handleReservePerHour();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledWrapper>
      <StyledHeader>
        <StyledDateLabel>{format(date, 'EEEE d/MM/yyyy', { locale: es })}</StyledDateLabel>
        {reserveTypeSelected && <StyledCreditsLabel>{pluralize(credits, 'crédito', true)}</StyledCreditsLabel>}
      </StyledHeader>
      <StyledOptionsWrapper>
        <StyledRadioButtonsWrapper>
          {(hourly?.dayCreditsWithFee || 0) > 0 && (
            <StyledRadioButtonWrapper
              ref={ref => (radioRefs.current.PER_HOUR = ref)}
              optionValue={SpaceReservationHourlyTypes.PER_HOUR}
              optionValueSelected={reserveTypeSelected}
              arrowPosition={arrowPosition}>
              <StyledRadioButton
                label='Por hora'
                name={nameField('type')}
                onChange={handleReservePerHour}
                checked={reserveTypeSelected === SpaceReservationHourlyTypes.PER_HOUR}
              />
            </StyledRadioButtonWrapper>
          )}
          <StyledBreakpointBox initialDisplay='none' breakpoints={{ md: 'flex' }}>
            {PerHourForm(reserveTypeSelected)}
          </StyledBreakpointBox>
          {(hourly?.halfDayCreditsWithFee || 0) > 0 && (
            <StyledRadioButtonWrapper
              ref={ref => (radioRefs.current.HALF_DAY = ref)}
              optionValue={SpaceReservationHourlyTypes.HALF_DAY}
              optionValueSelected={reserveTypeSelected}
              arrowPosition={arrowPosition}>
              <StyledRadioButton
                label='Por medio día'
                name={nameField('type')}
                onChange={handleReservePerHalfDay}
                checked={reserveTypeSelected === SpaceReservationHourlyTypes.HALF_DAY}
              />
            </StyledRadioButtonWrapper>
          )}
          <StyledBreakpointBox initialDisplay='none' breakpoints={{ md: 'flex' }}>
            {HalfDayForm(reserveTypeSelected)}
          </StyledBreakpointBox>
          {(hourly?.fullDayCreditsWithFee || 0) > 0 && (
            <StyledRadioButtonWrapper
              ref={ref => (radioRefs.current.DAYPASS = ref)}
              optionValue={SpaceReservationHourlyTypes.DAYPASS}
              optionValueSelected={reserveTypeSelected}
              arrowPosition={arrowPosition}>
              <StyledRadioButton
                label='Daypass'
                name={nameField('type')}
                onChange={() => setInNameFieldValue('type', SpaceReservationHourlyTypes.DAYPASS)}
                checked={reserveTypeSelected === SpaceReservationHourlyTypes.DAYPASS}
              />
            </StyledRadioButtonWrapper>
          )}
        </StyledRadioButtonsWrapper>
        <StyledBreakpointBox initialDisplay='flex' breakpoints={{ md: 'none' }}>
          <StyledDivider />
          <StyledOptionFieldsWrapper>
            {reserveTypeSelected === SpaceReservationHourlyTypes.PER_HOUR && (
              <StyledPerHourOptionFieldsWrapper>
                <TimePicker name={nameField('perHour.start')} />
                <StyledPerHourSeparatorWrapper>
                  <StyledPerHourSeparator />
                </StyledPerHourSeparatorWrapper>
                <TimePicker name={nameField('perHour.end')} />
              </StyledPerHourOptionFieldsWrapper>
            )}
            {reserveTypeSelected === SpaceReservationHourlyTypes.HALF_DAY && (
              <StyledPerHalfDayOptionFieldsWrapper>
                <StyledRadioButtonWrapper showArrow={false}>
                  <StyledHalfDayRadioButton
                    label='Mañana - Tarde'
                    name={nameField('halfDayType')}
                    onChange={() => setInNameFieldValue('halfDay', SpaceReservationHalfDayTypes.MORNING)}
                    checked={halfDayTypeSelected === SpaceReservationHalfDayTypes.MORNING}
                  />
                </StyledRadioButtonWrapper>
                <StyledRadioButtonWrapper showArrow={false}>
                  <StyledHalfDayRadioButton
                    label='Tarde - Noche'
                    name={nameField('halfDayType')}
                    onChange={() => setInNameFieldValue('halfDay', SpaceReservationHalfDayTypes.AFTERNOON)}
                    checked={halfDayTypeSelected === SpaceReservationHalfDayTypes.AFTERNOON}
                  />
                </StyledRadioButtonWrapper>
              </StyledPerHalfDayOptionFieldsWrapper>
            )}
          </StyledOptionFieldsWrapper>
        </StyledBreakpointBox>
      </StyledOptionsWrapper>
    </StyledWrapper>
  );
};

export default ReservationTypeOption;
