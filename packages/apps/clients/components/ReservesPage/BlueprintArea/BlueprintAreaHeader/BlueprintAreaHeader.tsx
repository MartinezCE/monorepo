import React from 'react';
import styled, { css } from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  column-gap: 24px;
`;
const StyledElement = styled.div`
  display: flex;
  align-items: center;
`;

const circleConfig = {
  available: css`
    background-color: ${({ theme }) => theme.colors.success};
  `,
  occupied: css`
    background-color: ${({ theme }) => theme.colors.error};
  `,
  half: css`
    background: ${({ theme }) =>
      `linear-gradient(to bottom, ${theme.colors.error} 0%, ${theme.colors.error} 50%, ${theme.colors.success} 50%, ${theme.colors.success} 100%)`};
  `,
  notAvailable: css`
    background-color: ${({ theme }) => theme.colors.gray};
  `,
  meetingRoom: css`
    background-color: ${({ theme }) => theme.colors.blue};
  `,
};

type CircleProps = {
  type: 'available' | 'occupied' | 'half' | 'notAvailable' | 'meetingRoom';
};

const StyledCircle = styled.div<CircleProps>`
  height: 12px;
  width: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  ${({ type }) => circleConfig[type]};
`;
const StyledTitle = styled.div`
  margin-left: 8px;
  font-size: 12px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const BlueprintAreaHeader = () => (
  <StyledWrapper>
    <StyledElement>
      <StyledCircle type='meetingRoom' />
      <StyledTitle>Salas de reuniones</StyledTitle>
    </StyledElement>
    <StyledElement>
      <StyledCircle type='available' />
      <StyledTitle>Asientos disponibles</StyledTitle>
    </StyledElement>
    <StyledElement>
      <StyledCircle type='occupied' />
      <StyledTitle>Asientos ocupados</StyledTitle>
    </StyledElement>
    <StyledElement>
      <StyledCircle type='half' />
      <StyledTitle>Asientos ocupados medio día</StyledTitle>
    </StyledElement>
    <StyledElement>
      <StyledCircle type='notAvailable' />
      <StyledTitle>Asientos no disponibles</StyledTitle>
    </StyledElement>
  </StyledWrapper>
);

export default BlueprintAreaHeader;
