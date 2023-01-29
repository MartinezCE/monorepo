import styled from 'styled-components';

const StyledHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.8em;
`;

const StyledHeaderInfoTitle = styled.p`
  font-size: 30px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.extraDarkBlue};
`;

const StyledLocationName = styled.p`
  font-size: 30px;
  color: ${({ theme }) => theme.colors.extraDarkBlue};
`;

const CustomHeader = ({ section, locationName = '' }: { section?: string; locationName?: string }) => (
  <StyledHeaderInfo>
    {section && <StyledHeaderInfoTitle>{section}</StyledHeaderInfoTitle>}
    <StyledLocationName>{locationName}</StyledLocationName>
  </StyledHeaderInfo>
);

export default CustomHeader;
