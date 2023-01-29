import React from 'react';
import { RadioButton } from '@wimet/apps-shared';
import { lastDayOfMonth, format } from 'date-fns';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { initialValues } from '../../../../../pages/pass/plans/new/[planType]';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledText = styled.p`
  margin-bottom: 32px;
  & span {
    font-weight: 500;
  }
`;
const StyledMethodText = styled.p`
  margin-bottom: 24px;
`;

const OptionsWrapper = styled.div`
  margin-bottom: 48px;
`;

const StyledRadioButton = styled(RadioButton)`
  margin-bottom: 20px;
  & :last-child {
    margin-bottom: 0;
  }
  & span {
    font-size: 14px;
    margin: 0;
  }
`;

const PayAsYouGoPlanCardContent = () => {
  const { values } = useFormikContext<typeof initialValues>();
  return (
    <StyledWrapper>
      <StyledText>
        El plan se cobrará el día <span>{format(lastDayOfMonth(values.startDate), 'dd/MM/yyyy')}</span>. El monto del
        mismo dependerá del uso de créditos que tus colaboradores hagan durante el mes.
      </StyledText>
      <StyledMethodText>Método de Pago:</StyledMethodText>
      <OptionsWrapper>
        <StyledRadioButton label='Débito en cuenta' name='payMethod' />
        <StyledRadioButton label='Transferencia' name='payMethod' />
        <StyledRadioButton label='Decidir más adelante' name='payMethod' />
      </OptionsWrapper>
    </StyledWrapper>
  );
};

export default PayAsYouGoPlanCardContent;
