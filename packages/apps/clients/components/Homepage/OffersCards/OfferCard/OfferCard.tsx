import { Button } from '@wimet/apps-shared';
import React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 32px;
  box-shadow: 0px 20px 50px rgba(44, 48, 56, 0.12);
  border-radius: 8px;
`;
const StyledCardTitle = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: 500;
`;
const StyledCardSubtitle = styled.div`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 200;
  line-height: 20px;
  margin-bottom: 70px;
`;
const StyledCardActions = styled.div`
  position: absolute;
  bottom: 32px;
`;

type Props = {
  title: string;
  subtitle: string;
  actionText: string;
  onClick: () => void;
};

const OfferCard = ({ title, subtitle, actionText, onClick }: Props) => (
  <StyledCard>
    <StyledCardTitle>{title}</StyledCardTitle>
    <StyledCardSubtitle>{subtitle}</StyledCardSubtitle>
    <StyledCardActions>
      <Button variant='primary' onClick={onClick}>
        {actionText}
      </Button>
    </StyledCardActions>
  </StyledCard>
);

export default OfferCard;
