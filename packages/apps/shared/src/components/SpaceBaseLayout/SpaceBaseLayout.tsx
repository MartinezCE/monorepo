import React from 'react';
import styled from 'styled-components';
import BackLink from '../BackLink';

const StyledWrapper = styled.div`
  padding: 60px 0;
  padding-left: 75px;
`;

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
`;

const StyledBackLink = styled(BackLink)`
  margin-bottom: 12px;
  margin-left: -5px;
  column-gap: 2px;
`;

type Props = {
  children: React.ReactNode;
  backLinkHref?: string;
  backLinkTitle?: string;
};

const SpaceBaseLayout = ({ children, backLinkHref, backLinkTitle }: Props) => (
  <StyledWrapper>
    {backLinkHref && backLinkTitle && <StyledBackLink href={backLinkHref}>{backLinkTitle}</StyledBackLink>}
    <StyledList>{children}</StyledList>
  </StyledWrapper>
);

export default SpaceBaseLayout;
