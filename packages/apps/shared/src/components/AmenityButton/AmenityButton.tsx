import { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import Button from '../Button';
import Label from '../Label';

const StyledButton = styled(Button)`
  width: 48px;
  height: 48px;
  justify-content: center;
  color: ${({ theme }) => theme.colors.darkGray};
  border-radius: 6px;
  border: 2px solid transparent;
  padding: 11px;
  transition: border 0.1s ease-in-out, color 0.1s ease-in-out, background-color 0.1s ease-in-out;
`;

const StyledInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 8px;
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledLabel = styled(Label)`
  text-align: center;
  min-width: 100px;
  width: fit-content;
  font-weight: inherit;
  transition: color 0.1s ease-in-out;
`;

type StyledButtonWrapperProps = {
  active?: boolean;
};

const StyledButtonWrapper = styled.div<StyledButtonWrapperProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 8px;
  width: 100px;
  height: 96px;

  ${({ active }) =>
    active &&
    css`
      ${StyledButton} {
        border: 2px solid ${({ theme }) => theme.colors.blue};
      }

      ${StyledInnerWrapper} {
        color: ${({ theme }) => theme.colors.blue};
        font-weight: ${({ theme }) => theme.fontWeight[2]};
      }
    `}
`;

type Props = {
  icon?: JSX.Element;
  label?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
};

export default function AmenityButton({ icon, label, active, onClick, className, children }: Props) {
  return (
    <StyledButtonWrapper className={className} active={active}>
      <StyledButton variant='fourth' leadingIcon={icon} onClick={onClick} />
      <StyledInnerWrapper>
        <StyledLabel text={label} variant='currentColor' lowercase />
        {children}
      </StyledInnerWrapper>
    </StyledButtonWrapper>
  );
}
