/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorText, InnerStepFormLayout, Input } from '@wimet/apps-shared';
import { Fragment } from 'react';
import styled, { css } from 'styled-components';
import { ErrorMessage, useFormikContext } from 'formik';
import LabeledCheckbox from '../../UI/LabeledCheckbox';
import useSchedule, { NUMERIC_ALL_DAYS } from './useSchedule';
import { DaySelector } from '../../common';
import RowActionButtons from '../../common/RowActionButtons';
import { EditSpaceInitialValues } from '../../../pages/locations/[locationId]/spaces/[spaceId]/edit';

const StyledInnerStepFormLayout = styled(InnerStepFormLayout)`
  max-width: fit-content;
`;

const StyledWrapper = styled.div`
  margin: 52px 0;
  display: grid;
  grid-template-columns: min-content max-content min-content;
  row-gap: 40px;
  column-gap: 40px;
`;

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

const StyledRow = styled.div`
  display: flex;
  column-gap: 40px;
`;

const StyledInputWrapper = styled.div`
  display: flex;
  column-gap: 24px;
  align-items: flex-start;
  height: fit-content;
  padding-top: 4px;
`;

const StyledInput = styled(Input)`
  width: 80px;

  input {
    padding: 6px 12px;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      > div {
        border: 1px solid ${({ theme }) => theme.colors.gray};
      }
    `}
`;

const StyledCheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  height: fit-content;
  align-self: flex-end;
  flex-shrink: 0;
  padding-bottom: 4px;
`;

const StyledLabeledCheckbox = styled(LabeledCheckbox)`
  font-weight: ${({ theme }) => theme.fontWeight[0]};

  div {
    width: 20px;
    height: 20px;
  }
`;

const StyledDaySelectorWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: auto;
`;

type Props = {
  description: string;
};

export default function SelectAvailabilitySection({ description }: Props) {
  const { setValues, values } = useFormikContext<EditSpaceInitialValues>();
  const { groups, handleChange, handleRemoveClick, handleAddClick, selectOptions, handleChangeSelect, selectValue } =
    useSchedule({
      fieldName: 'schedule',
      defaultValues: [{ dayOfWeek: null, openTime: '', closeTime: '', is24Open: false }],
    });

  const handleOnChangeInputs = (indexs: number[], newScheduleValue: object) => {
    const schedule = values.schedule.map((s, i) => {
      if (indexs.includes(i)) return { ...s, ...newScheduleValue };
      return s;
    });
    setValues({ ...values, schedule });
  };

  return (
    <StyledInnerStepFormLayout label='Disponibilidad' description={description}>
      <StyledWrapper>
        {groups.map((line, i) => {
          const { daysOfWeek, indexs, ...meta } = line;
          const disabledDays = NUMERIC_ALL_DAYS.filter(
            d =>
              values.spaceReservationTypeId === 1 &&
              !values.hourly?.some((s: { dayOfWeek: number }) => s.dayOfWeek === d)
          );

          return (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={i}>
              <StyledDaySelectorWrapper>
                <DaySelector
                  name='schedule'
                  options={selectOptions}
                  value={selectValue}
                  days={daysOfWeek}
                  disabledDaysOfWeek={disabledDays}
                  selectOnChange={(e: any) => handleChangeSelect(e, meta)}
                  onChange={(isSelected, dayIndex) => handleChange(isSelected, dayIndex, meta, daysOfWeek)}
                />
              </StyledDaySelectorWrapper>
              <StyledColumn>
                <StyledRow>
                  <StyledInputWrapper>
                    <StyledInput
                      label='Desde*'
                      placeholder='9:00'
                      variant='withText'
                      onChange={e => handleOnChangeInputs(indexs, { openTime: e.target.value })}
                      name={`schedule[${indexs[0]}].openTime`}
                      disabled={meta.is24Open}
                    />
                    <StyledInput
                      label='Hasta*'
                      placeholder='18:00'
                      variant='withText'
                      onChange={e => handleOnChangeInputs(indexs, { closeTime: e.target.value })}
                      name={`schedule[${indexs[0]}].closeTime`}
                      disabled={meta.is24Open}
                    />
                  </StyledInputWrapper>
                  <StyledCheckboxWrapper>
                    <StyledLabeledCheckbox
                      label='Disponible 24 hs.'
                      onChange={e => handleOnChangeInputs(indexs, { is24Open: e.target.checked })}
                      checked={meta.is24Open}
                    />
                  </StyledCheckboxWrapper>
                </StyledRow>
                <ErrorMessage
                  name={`schedule[${indexs[0]}]`}
                  render={(e: any) => !!e?.isHourValid && <ErrorText>{e.isHourValid}</ErrorText>}
                />
              </StyledColumn>
              <RowActionButtons
                showAdd={groups.length - 1 === i}
                onDuplicate={() => handleAddClick(meta)}
                onDelete={() => handleRemoveClick(daysOfWeek)}
                onAdd={() => handleAddClick({ dayOfWeek: null, openTime: '', closeTime: '', is24Open: false })}
              />
            </Fragment>
          );
        })}
      </StyledWrapper>
    </StyledInnerStepFormLayout>
  );
}
