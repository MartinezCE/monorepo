import { Button } from '@wimet/apps-shared';
import { ButtonIconMixin } from '@wimet/apps-shared/lib/common/mixins';
import styled from 'styled-components';

type RoundWrapperProps = {
  pSize?: 'sm' | 'md' | 'lg';
  isColumn?: boolean;
  width?: string;
};

const paddings = {
  sm: '12px',
  md: '16px',
  lg: '22px',
};

export const RoundWrapper = styled.div<RoundWrapperProps>`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: ${({ pSize }) => paddings[pSize || 'sm']};
  display: flex;
  flex-direction: ${({ isColumn }) => (isColumn ? 'column' : 'row')};
  align-items: center;
  width: ${({ width }) => width || 'fit-content'};
`;

export const IconButton = styled(Button)`
  ${ButtonIconMixin};
`;
