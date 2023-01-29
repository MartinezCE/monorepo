import { Button, images } from '@wimet/apps-shared';
import React from 'react';
import styled from 'styled-components';

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 48px;
`;

const StyledTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.extraDarkBlue};
`;

const CollaboratorsHeader = ({ onClickCreate }: { onClickCreate: () => void }) => (
  <StyledHeader>
    <StyledTitle>Colaboradores</StyledTitle>
    <Button variant='primary' trailingIcon={<images.TinyMore />} onClick={onClickCreate}>
      Agregar miembro
    </Button>
  </StyledHeader>
);

export default CollaboratorsHeader;
