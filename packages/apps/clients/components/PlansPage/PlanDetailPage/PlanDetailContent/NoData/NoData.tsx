import React from 'react';
import { images } from '@wimet/apps-shared';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 125px;
`;

const StyledText = styled.div`
  margin-top: 40px;
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
`;

type Props = {
  title: string;
};

const NoData = ({ title }: Props) => (
  <StyledWrapper>
    <images.NightTable />
    <StyledText>{title}</StyledText>
  </StyledWrapper>
);

export default NoData;
