import styled from 'styled-components';

const StyledContentWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const SeatInfoPopupContainer: React.FC<{ className?: string }> = ({ className, children }) => (
  <StyledContentWrapper className={className}>{children}</StyledContentWrapper>
);

export default SeatInfoPopupContainer;
