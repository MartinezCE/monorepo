import styled from 'styled-components';

const StyledWrapper = styled.div`
  width: 248px;
`;

const StyledHeader = styled.div`
  padding: 16px 24px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.extraLightBlue};
`;

const StyledHeaderTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  column-gap: 16px;
`;

const StyledHeaderTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes[4]};
  line-height: ${({ theme }) => theme.lineHeights[2]};
  font-weight: ${({ theme }) => theme.fontWeight[2]};
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledHeaderSubtitle = styled(StyledHeaderTitle)`
  font-size: ${({ theme }) => theme.fontSizes[0]};
  line-height: ${({ theme }) => theme.lineHeights[0]};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
`;

const StyledContentWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  overflow-y: auto;
  max-height: 244px;
`;

type Props = {
  name?: string;
  address?: string;
  children?: React.ReactNode;
};

const LiveMapPopupBase = ({ name, address, children }: Props) => (
  <StyledWrapper>
    <StyledHeader>
      <StyledHeaderTitleWrapper>
        <StyledHeaderTitle>{name}</StyledHeaderTitle>
        <StyledHeaderSubtitle>{address}</StyledHeaderSubtitle>
      </StyledHeaderTitleWrapper>
    </StyledHeader>
    <StyledContentWrapper>{children}</StyledContentWrapper>
  </StyledWrapper>
);

export default LiveMapPopupBase;
