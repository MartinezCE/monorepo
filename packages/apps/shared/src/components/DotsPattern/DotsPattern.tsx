import styled from 'styled-components';

type DotsPatternType = {
  small?: boolean;
};
const StyledDotWrapper = styled.div<DotsPatternType>`
  display: grid;
  grid-template-columns: repeat(10, min-content);
  grid-template-rows: repeat(10, min-content);
  gap: ${({ small }) => (small ? '8.2px' : '11px')};
`;

const StyledDot = styled.div<DotsPatternType>`
  width: ${({ small }) => (small ? '3.72px' : '5px')};
  height: ${({ small }) => (small ? '3.72px' : '5px')};
  background-color: ${({ theme }) => theme.colors.semiDarkGray};
  border-radius: 999px;
`;

const pattern = Array(100)
  .fill(null)
  .map((_, i) => (
    <StyledDot key={i} /> // eslint-disable-line react/no-array-index-key
  ));

type DotsPatternProps = {
  className?: string;
  small?: boolean;
};

export default function DotsPattern({ className, small = false }: DotsPatternProps) {
  return (
    <StyledDotWrapper className={className} small={small}>
      {pattern}
    </StyledDotWrapper>
  );
}
