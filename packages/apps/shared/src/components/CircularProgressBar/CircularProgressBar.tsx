import { ComponentProps } from 'react';
import styled, { useTheme } from 'styled-components';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const StyledText = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes[0]};
  line-height: ${({ theme }) => theme.lineHeights[0]};
`;

type Props = Partial<ComponentProps<typeof CircularProgressbarWithChildren>> & {
  value?: number;
  showProgressText?: boolean;
};

export default function ProgressBar({
  value = 0,
  strokeWidth = 10,
  children,
  showProgressText = true,
  ...props
}: Props) {
  const theme = useTheme();

  return (
    <CircularProgressbarWithChildren
      value={value}
      strokeWidth={strokeWidth}
      styles={buildStyles({
        trailColor: theme.colors.lightOrange,
        pathColor: theme.colors.orange,
      })}
      {...props}>
      {!children && showProgressText ? <StyledText>{value}%</StyledText> : children}
    </CircularProgressbarWithChildren>
  );
}
