import {
  BackLink,
  Button,
  DatePickerInput,
  InputNumber,
  LoadingSpinner,
  PlanRenovation,
  PlanTypes,
  planTypesLabels,
  pluralize,
  TitleEditable,
  useGetMe,
} from '@wimet/apps-shared';
import { formatInTimeZone } from 'date-fns-tz';
import { FormikProvider, useFormik } from 'formik';
import React from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import useGetPlanUsedCredits from '../../../../hooks/api/useGetPlanUsedCredits';
import useUpdatePlan from '../../../../hooks/api/useUpdatePlan';
import RulesSelect from '../../RulesSelect';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 104px 40px 75px;
  border-radius: 0px 0px 8px 8px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const StyledHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 19px;
`;

const StyledNameWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const StyledTitleEditable = styled(TitleEditable)`
  & input {
    color: ${({ theme }) => theme.colors.darkGray};
  }
`;

const StyledPlanType = styled.div`
  margin-right: 12px;
  font-size: 20px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.blue};
`;

const StyledInfoWrapper = styled.div`
  display: flex;
`;

const StyledCredits = styled.div`
  display: flex;
  font-size: 32px;
  margin-right: 160px;
  align-items: baseline;
  color: ${({ theme }) => theme.colors.blue};
`;

const StyledUsedCredits = styled.div`
  font-weight: 500;
`;
const StyledCreditsText = styled.div`
  font-weight: 200;
`;
const StyledSmallCreditsText = styled.div`
  margin-left: 8px;
  font-size: 16px;
  font-weight: 200;
`;

const StyledGridWrapper = styled.div`
  display: grid;
  margin-top: 64px;
  padding-right: 160px;
  gap: 40px;
  grid-template-columns: repeat(2, calc(50% - 20px));
`;

const StyledDatePickerInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const StyledReserveText = styled.div`
  position: absolute;
  display: flex;
  font-size: 12px;
  bottom: -20px;
  right: 0px;
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const StyledReserveLabel = styled.div`
  font-weight: 500;
`;

const StyledReserveValue = styled.div`
  margin-left: 4px;
  font-weight: 200;
`;

const StyledActionsWrapper = styled.div`
  margin-right: 160px;
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
`;

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido'),
  start: Yup.date().required('Fecha de inicio requerida'),
  maxPersonalCredits: Yup.number()
    .min(1, 'El número tiene que ser mayor a 0')
    .required('Máximo de créditos personales requerido'),
  maxReservationCredits: Yup.number()
    .min(1, 'El número tiene que ser mayor a 0')
    .required('Máximo de créditos de reserva requerido'),
});

type Props = {
  planId: number;
  name: string;
  type: PlanTypes;
  start: Date;
  renovation: PlanRenovation;
  maxPersonalCredits: number;
  maxReservationCredits: number;
  availableCredits?: number | null;
};

const PlanDetailHeaderForm = ({
  planId,
  name,
  type,
  start,
  renovation,
  maxPersonalCredits,
  maxReservationCredits,
  availableCredits,
}: Props) => {
  const { data: userData } = useGetMe();
  const { data: { usedCredits } = { usedCredits: 0 }, isLoading } = useGetPlanUsedCredits(planId);
  const { mutateAsync } = useUpdatePlan(planId);
  const formik = useFormik({
    initialValues: { name, start, maxPersonalCredits, maxReservationCredits },
    validationSchema,
    onSubmit: async ({ start: __, ...values }, _formik) => {
      try {
        await mutateAsync(values);
        _formik.setSubmitting(false);
      } catch (_) {
        _formik.setTouched({});
        _formik.setSubmitting(false);
      }
    },
  });

  return (
    <StyledWrapper>
      <FormikProvider value={formik}>
        <BackLink href='/pass/plans'>Planes</BackLink>
        <StyledHeaderContainer>
          <StyledNameWrapper>
            <StyledPlanType>{`Plan ${planTypesLabels[type]}`}</StyledPlanType>
            <StyledTitleEditable names={['name']} buttonVariant='secondary' buttonLeftSeparation={24} />
          </StyledNameWrapper>
          <StyledInfoWrapper>
            <StyledCredits>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <StyledUsedCredits>{usedCredits}</StyledUsedCredits>
                  {availableCredits && <StyledCreditsText>{`/${availableCredits}`}</StyledCreditsText>}
                  <StyledSmallCreditsText>
                    {!availableCredits
                      ? `${pluralize(usedCredits, 'crédito')} ${pluralize(usedCredits, 'utilizado')}`
                      : `${pluralize(availableCredits, 'crédito')}`}
                  </StyledSmallCreditsText>
                </>
              )}
            </StyledCredits>
          </StyledInfoWrapper>
        </StyledHeaderContainer>
        <StyledGridWrapper>
          <StyledDatePickerInputWrapper>
            <DatePickerInput name='start' label='Fecha de inicio' disabled />
            <StyledReserveText>
              <StyledReserveLabel>Renovación:</StyledReserveLabel>
              <StyledReserveValue>
                {formatInTimeZone(renovation.endDate, String(userData?.companies[0].tz), 'dd/MM/yyyy')}
              </StyledReserveValue>
            </StyledReserveText>
          </StyledDatePickerInputWrapper>
          <RulesSelect />
          <InputNumber
            label='Máximo de créditos por persona / mes'
            type='number'
            placeholder='60'
            name='maxPersonalCredits'
          />
          <InputNumber
            label='Máximo de créditos por reserva'
            type='number'
            placeholder='24'
            name='maxReservationCredits'
          />
        </StyledGridWrapper>
        <StyledActionsWrapper>
          <Button
            variant='primary'
            type='submit'
            onClick={formik.submitForm}
            disabled={formik.isSubmitting}
            trailingIcon={formik.isSubmitting ? <LoadingSpinner /> : undefined}>
            Guardar cambios
          </Button>
        </StyledActionsWrapper>
      </FormikProvider>
    </StyledWrapper>
  );
};

export default PlanDetailHeaderForm;
