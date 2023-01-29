import { Button, Tooltip } from '@wimet/apps-shared';
import styled, { css } from 'styled-components';

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledTooltip = styled(Tooltip)`
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  top: calc(100% + 18px);
  z-index: 1;
  pointer-events: none;

  > div {
    background-color: ${({ theme }) => theme.colors.lighterGray};
  }

  > div:after {
    border-right-color: ${({ theme }) => theme.colors.lighterGray};
  }
`;

type StyledButtonProps = {
  active?: boolean;
};

const StyledButton = styled(Button)<StyledButtonProps>`
  width: 32px;
  height: 32px;
  background-color: unset;
  color: ${({ theme }) => theme.colors.darkGray};
  padding: unset;
  align-items: center;
  justify-content: center;

  ${({ active }) =>
    active
      ? css`
          background-color: ${({ theme }) => theme.colors.lightBlue};
        `
      : css`
          :focus {
            background-color: unset;
          }

          :hover {
            background-color: ${({ theme }) => theme.colors.mediumLightBlue};
          }
        `}

  :hover + ${StyledTooltip} {
    opacity: 1;
  }
`;

type Props = {
  icon: JSX.Element;
  tooltipLabel: string;
  active?: boolean;
  onClick?: () => void;
};

const BarButton = ({ icon, tooltipLabel, active, onClick }: Props) => (
  <StyledWrapper>
    <StyledButton variant='secondary' active={active} leadingIcon={icon} onClick={onClick} />
    <StyledTooltip>{tooltipLabel}</StyledTooltip>
  </StyledWrapper>
);

export default BarButton;
