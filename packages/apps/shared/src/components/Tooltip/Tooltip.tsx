import { ReactNode } from 'react';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

const directionStyles: { [k in StyledWrapperProps['direction']]: FlattenSimpleInterpolation } = {
  top: css`
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);

    > div {
      margin-bottom: 7px;

      :after {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) translateY(100%) rotateZ(-90deg);
      }
    }
  `,
  bottom: css`
    top: 100%;
    left: 50%;
    transform: translateX(-50%);

    > div {
      margin-top: 7px;

      :after {
        top: 0;
        left: 50%;
        transform: translateX(-50%) translateY(-100%) rotateZ(90deg);
      }
    }
  `,
  left: css`
    top: 50%;
    right: 100%;
    transform: translateY(-50%);

    > div {
      margin-right: 7px;

      :after {
        top: 50%;
        left: 100%;
        transform: translateY(-50%) rotate(180deg);
      }
    }
  `,
  right: css`
    top: 50%;
    left: 100%;
    transform: translateY(-50%);

    > div {
      margin-left: 7px;

      :after {
        top: 50%;
        right: 100%;
        transform: translateY(-50%);
      }
    }
  `,
};

type StyledWrapperProps = {
  direction?: 'top' | 'bottom' | 'left' | 'right';
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  width: max-content;
  position: absolute;
  cursor: default;
  font-size: ${({ theme }) => theme.fontSizes[0]};
  line-height: ${({ theme }) => theme.lineHeights[0]};
  font-weight: ${({ theme }) => theme.fontWeight[1]};
  color: ${({ theme }) => theme.colors.darkGray};
  transition: opacity 0.2s ease-in-out;

  :hover,
  :active,
  :focus {
    color: ${({ theme }) => theme.colors.darkGray};
  }

  ${({ direction }) => directionStyles[direction]}
`;

const StyledTooltip = styled.div`
  position: relative;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.extraLightBlue};

  :after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-width: 7px;
    border-style: solid;
    border-radius: 1px;
    border-color: transparent ${({ theme }) => theme.colors.extraLightBlue} transparent transparent;
  }
`;

type Props = {
  className?: string;
  children?: ReactNode;
  direction?: StyledWrapperProps['direction'];
};

export default function Tooltip({ className, children, direction = 'bottom' }: Props) {
  return (
    <StyledWrapper className={className} direction={direction}>
      <StyledTooltip>{children}</StyledTooltip>
    </StyledWrapper>
  );
}
