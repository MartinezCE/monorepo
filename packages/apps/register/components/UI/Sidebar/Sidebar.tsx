import styled from 'styled-components';
import { mixins, SidebarBase, Text } from '@wimet/apps-shared';

const StyledSidebarBase = styled(SidebarBase)`
  ${mixins.Layout}
  width: 493px;
  padding-top: ${({ theme }) => theme.heights.header} !important; // TODO: Remove '!important' when mobile UI is ready
`;

const StyledInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  width: 100%;
  height: 100%;
  padding: 73px 0;

  > * {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const StyledTitle = styled.h5`
  width: 230px;
`;

const StyledDescription = styled(Text)`
  width: 285px;
`;

type Props = {
  title?: string;
  description?: string;
};

export default function Sidebar({ title, description }: Props) {
  return (
    <StyledSidebarBase>
      <StyledInnerWrapper>
        {title && <StyledTitle>{title}</StyledTitle>}
        {description && <StyledDescription>{description}</StyledDescription>}
      </StyledInnerWrapper>
    </StyledSidebarBase>
  );
}
