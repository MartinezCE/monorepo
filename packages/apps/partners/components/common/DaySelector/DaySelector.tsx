/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, ErrorText, Select } from '@wimet/apps-shared';
import { ErrorMessage } from 'formik';
import styled, { css } from 'styled-components';
import { NUMERIC_ALL_DAYS } from '../../LocationNewSpacePage/SelectAvailabilitySection/useSchedule';

const DaySelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  justify-content: center;
`;

const StyledSelect = styled(Select)`
  width: fit-content;
`;

const DaysButtonWrapper = styled.div`
  display: flex;
  column-gap: 8px;
`;

type DayButtonProps = {
  isSelected?: boolean;
};

const DayButton = styled(Button)<DayButtonProps>`
  width: 20px;
  height: 20px;
  padding: 0;
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.darkBlue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  line-height: ${({ theme }) => theme.lineHeights[0]};
  font-weight: ${({ theme }) => theme.fontWeight[0]};

  ${({ isSelected }) =>
    isSelected &&
    css`
      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.blue};

      &:hover,
      &:focus {
        background-color: ${({ theme }) => theme.colors.blue};
      }
    `}
`;

export type Day = number;

const config = {
  '0': 'L',
  '1': 'M',
  '2': 'M',
  '3': 'J',
  '4': 'V',
  '5': 'S',
  '6': 'D',
};

type Props = {
  days?: Day[];
  disabledDaysOfWeek?: Day[];
  onChange?: (isSelected: boolean, days: Day) => void;
  selectOnChange?: any;
  options: any;
  value: any;
  name: string;
};

export default function DaySelector({
  days,
  disabledDaysOfWeek,
  onChange,
  options,
  value,
  selectOnChange,
  name,
}: Props) {
  return (
    <DaySelectorWrapper>
      <StyledSelect
        instanceId='daySelect'
        options={options}
        value={value}
        variant='secondary'
        onChange={v => {
          selectOnChange?.(v);
        }}
        isSearchable={false}
        name='daySelect'
      />
      <DaysButtonWrapper>
        {NUMERIC_ALL_DAYS.map(day => {
          const isDisabled = disabledDaysOfWeek?.includes(day);
          const isSelected = !isDisabled && !!days?.includes(day);
          return (
            <DayButton
              key={day}
              variant='secondary'
              isSelected={isSelected}
              onClick={() => !isDisabled && onChange?.(isSelected, day)}
              disabled={isDisabled}>
              {config[day.toString() as keyof typeof config]}
            </DayButton>
          );
        })}
      </DaysButtonWrapper>
      <ErrorMessage name={name} render={e => typeof e === 'string' && <ErrorText>{e}</ErrorText>} />
    </DaySelectorWrapper>
  );
}
