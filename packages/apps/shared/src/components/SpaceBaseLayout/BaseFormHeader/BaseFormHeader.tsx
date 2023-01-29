import { ReactNode } from 'react';
import styled from 'styled-components';
import BaseHeaderTitle from '../../BaseHeaderTitle';

const StyledRow = styled.div`
  display: flex;
  align-items: center;
`;

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type Props = {
  children?: ReactNode;
  className?: string;
  primaryText?: string;
  secondaryText?: string;
  hideTitle?: boolean;
};

export default function BaseFormHeader({ children, hideTitle, className, primaryText, secondaryText }: Props) {
  return (
    <StyledRow className={className}>
      {!hideTitle && <BaseHeaderTitle primaryText={primaryText} secondaryText={secondaryText} />}
      <StyledWrapper>{children}</StyledWrapper>
    </StyledRow>
  );
}
