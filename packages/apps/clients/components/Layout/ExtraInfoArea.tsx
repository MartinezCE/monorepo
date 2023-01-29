import { Link } from '@wimet/apps-shared';
import React from 'react';
import styled from 'styled-components';

const StyledInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 48px;
`;
const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 200;
  margin-right: 48px;
`;

// const StyledBox = styled.div`
//   display: flex;
//   font-size: 12px;
//   border-radius: 4px;
//   padding: 8px 16px 8px 16px;
//   color: ${({ theme }) => theme.colors.blue};
//   border: 1px solid ${({ theme }) => theme.colors.blue};
// `;

// const StyledHighlightedText = styled.div`
//   font-weight: 500;
//   font-size: 12px;
// `;

const ExtraInfoArea = ({ country }: { country?: string }) => (
  <StyledInfoWrapper>
    <StyledLink
      href={`${process.env.NEXT_PUBLIC_INDEX_URL}/discover${country ? `?country=${country}` : ''}`}
      variant='fourth'
      noBackground>
      Explora Workspaces
    </StyledLink>
    {/* // TODO: Use this when we have credit data */}
    {/* <StyledBox>
      <StyledHighlightedText>24</StyledHighlightedText>&nbsp;créditos utilizados
    </StyledBox> */}
  </StyledInfoWrapper>
);

export default ExtraInfoArea;
