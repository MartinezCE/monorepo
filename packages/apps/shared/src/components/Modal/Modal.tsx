import { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '..';
import { Close } from '../../assets/images';
import { ShadowBox } from '../../common/mixins';

const StyledModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.darkGrayWithOpacity};
`;

type StyledModalProps = {
  variant?: 'dark' | 'light' | 'custom';
};

const StyledModal = styled.div<StyledModalProps>`
  ${ShadowBox}
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: fit-content;
  height: fit-content;
  background-color: ${({ theme }) => theme.colors.darkBlue};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;

  ${({ variant }) =>
    variant === 'light' &&
    css`
      background-color: ${({ theme }) => theme.colors.white};
      color: ${({ theme }) => theme.colors.darkGray};
    `}

  ${({ variant }) =>
    variant === 'custom' &&
    css`
      background-color: unset;
      color: unset;
      border-radius: unset;
    `}
`;

const StyledInnerWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
`;

type StyledCloseButtonProps = {
  modalIsDark?: boolean;
};

const StyledCloseButton = styled(Button)<StyledCloseButtonProps>`
  position: absolute;
  right: 28px;
  top: 28px;

  ${({ modalIsDark }) =>
    !modalIsDark &&
    css`
      color: ${({ theme }) => theme.colors.darkGray};
    `}
`;

type Props = {
  children?: ReactNode;
  className?: string;
  onClose?: () => void;
  variant?: StyledModalProps['variant'];
  showCloseButton?: boolean;
};

export default function Modal({ children, className, onClose, variant = 'dark', showCloseButton = true }: Props) {
  return (
    <StyledModalBackground className={className}>
      <StyledModal variant={variant}>
        <StyledInnerWrapper>
          {showCloseButton && (
            <StyledCloseButton
              variant='fifth'
              modalIsDark={variant === 'dark'}
              leadingIcon={<Close />}
              onClick={onClose}
              noBackground
            />
          )}
          {children}
        </StyledInnerWrapper>
      </StyledModal>
    </StyledModalBackground>
  );
}
