import { Credit, DatePickerInput, images, Input, InputNumber, Link, Slider } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';

import React from 'react';
import styled from 'styled-components';
import { initialValues } from '../../../../pages/pass/plans/new/[planType]';
import RulesSelect from '../../RulesSelect';
import CollaboratorsTagList from './CollaboratorsTagList';

const StyledWrapper = styled.div``;
const StyledHeaderTitle = styled.div`
  display: flex;
  align-items: center;
`;
const StyledPreviousArrowLink = styled(Link)`
  width: 34px;
  height: 34px;
  padding: 0;
  justify-content: center;
  margin-left: 24px;
`;

const IconArrowRight = styled(images.ArrowRight)`
  width: 20px;
  height: 20px;
  transform: rotate(180deg);
  & path {
    stroke-width: 2px;
  }
`;

const StyledTitleText = styled.span`
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: 24px;
  margin-left: 24px;
  font-weight: 500;
`;

const StyledFieldsWrapper = styled.div`
  margin-top: 56px;
  display: grid;
  gap: 40px;
`;

const StyledMonthCredits = styled.div`
  font-size: 12px;
  margin-top: 15px;
  & span {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.blue};
  }
`;

// const marks = {
//   1250: '-5%',
//   3750: '-7,5%',
//   5000: '-10%',
// };

type Props = {
  showMaxPersonalCredits?: boolean;
  showCreditsSlider?: boolean;
  creditsPrice?: Credit;
};

const NewPlanFormFields = ({ showMaxPersonalCredits = true, showCreditsSlider = false, creditsPrice }: Props) => {
  const { values } = useFormikContext<typeof initialValues>();
  const total = Number(creditsPrice?.value) * values.credits || 0;

  return (
    <StyledWrapper>
      <StyledHeaderTitle>
        <StyledPreviousArrowLink trailingIcon={<IconArrowRight />} variant='secondary' href='/pass/plans/list' />
        <StyledTitleText>Crea un plan para tu equipo</StyledTitleText>
      </StyledHeaderTitle>
      <StyledFieldsWrapper>
        <Input label='Nombre del plan' placeholder='Elige un nombre para este grupo. Ej. Equipo Ventas' name='name' />
        <CollaboratorsTagList />
        <DatePickerInput label='Fecha de inicio' placeholder='12/03/2022' name='startDate' />
        {showMaxPersonalCredits && (
          <InputNumber
            label='Máximo de créditos por persona / mes'
            type='number'
            placeholder='60'
            name='maxPersonalCredits'
          />
        )}

        {showCreditsSlider && (
          <div>
            <Slider tipProps={{}} name='credits' max={5000} />
            <StyledMonthCredits>
              Créditos por mes{' '}
              <span>equivale a un presupuesto de {`${creditsPrice?.currency.value || ''} ${total}`}</span>
            </StyledMonthCredits>
          </div>
        )}

        <InputNumber
          label='Máximo de créditos por reserva'
          type='number'
          placeholder='24'
          name='maxReservationCredits'
        />
        <RulesSelect />
      </StyledFieldsWrapper>
    </StyledWrapper>
  );
};

export default NewPlanFormFields;
