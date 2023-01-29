import styled from 'styled-components';

type StyledWrapperProps = {
  background?: string;
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  background: ${({ background, theme }) => background || theme.colors.blue};
  border-radius: 4px;
  width: max-content;
  height: max-content;
  padding: 2px 8px;
  font-size: ${({ theme }) => theme.fontSizes[0]};
  line-height: 16px;
  color: ${({ theme }) => theme.colors.white};
`;

type Props = {
  backgroundColor?: string;
  className?: string;
};

const Badge: React.FC<Props> = ({ children, backgroundColor, className }) => (
  <StyledWrapper background={backgroundColor} className={className}>
    {children}
  </StyledWrapper>
);

export default Badge;
