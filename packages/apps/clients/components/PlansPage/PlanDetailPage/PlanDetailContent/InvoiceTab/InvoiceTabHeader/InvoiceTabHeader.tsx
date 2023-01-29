import { Button } from '@wimet/apps-shared';
import React from 'react';
import styled from 'styled-components';
import { PLANS } from '../../../../../../mocks';

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const StyledInfoWrapper = styled.div``;
const StyledTitle = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.extraDarkBlue};
  margin-bottom: 24px;
  font-weight: 500;
`;
const StyledAccount = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.extraDarkBlue};
  margin-bottom: 8px;
  font-weight: 500;
`;
const StyledInfoText = styled.div`
  font-size: 16px;
  font-weight: 200;
  margin-bottom: 8px;
`;

const StyledActionWrapper = styled.div``;

type Props = {
  plan: typeof PLANS[0];
};

const InvoiceTabHeader = ({ plan }: Props) => (
  <StyledWrapper>
    <StyledInfoWrapper>
      <StyledTitle>{plan.paymentAccountDetails?.type}</StyledTitle>
      <StyledAccount>{`Cuenta N° ${plan.paymentAccountDetails?.accountNumber}`}</StyledAccount>
      <StyledInfoText>{`Nombre del titular: ${plan.paymentAccountDetails?.owner}`}</StyledInfoText>
      <StyledInfoText>{`CUIT/CUIL: ${plan.paymentAccountDetails?.cuitCuil}`}</StyledInfoText>
      <StyledInfoText>{`Entidad: ${plan.paymentAccountDetails?.entity}`}</StyledInfoText>
      <StyledInfoText>{`Tipo de cuenta: ${plan.paymentAccountDetails?.accountType}`}</StyledInfoText>
    </StyledInfoWrapper>
    <StyledActionWrapper>
      <Button variant='outline' onClick={() => {}}>
        Cambiar Método de Pago
      </Button>
    </StyledActionWrapper>
  </StyledWrapper>
);

export default InvoiceTabHeader;
