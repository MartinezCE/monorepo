import { Avatar, images } from '@wimet/apps-shared';
import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledCounter = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.white};
  padding: 3px 5px;
  min-width: 20px;
  min-height: 20px;
  border-radius: 20px;
`;

const StyledAvatar = styled(Avatar)`
  > div {
    box-shadow: 0px 20px 40px -12px ${({ theme }) => theme.colors.darkGrayWithOpacity};
    background-color: ${({ theme }) => theme.colors.lightBlue};
  }
`;

const StyledStaffIcon = styled(images.Staff)`
  color: ${({ theme }) => theme.colors.darkBlue};
`;

type Props = {
  count: number;
  size?: number;
};

const ClusteredAvatar = ({ count, size = 36 }: Props) => (
  <StyledWrapper>
    <StyledAvatar variant='white' size={size}>
      <StyledStaffIcon size={size} />
    </StyledAvatar>
    <StyledCounter>{count > 12 ? '+12' : count}</StyledCounter>
  </StyledWrapper>
);

export default ClusteredAvatar;
