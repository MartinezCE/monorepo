import styled from 'styled-components';
import { IconArrowDown } from '../../../../assets/images';
import { Link } from '../../../../hooks/api/types';

const StyledTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const StyledTitle = styled.p`
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes[2]};
`;

const StyledArrowIconWrapper = styled.div`
  position: relative;
  width: 16px;
  height: 16px;
  margin-left: 6px;
  transition: transform 0.2s ease-in-out;
`;

const StyledMenuItem = styled.li`
  list-style: none;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const StyledLink = styled.a`
  white-space: nowrap;
  text-decoration: none;
  display: flex;
  flex-direction: column;
`;

const StyledLinkTitle = styled.p`
  margin-bottom: 8px;
  line-height: ${({ theme }) => theme.lineHeights[1]};
  font-size: ${({ theme }) => theme.fontSizes[3]};
  font-weight: 700;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes[0]};
    line-height: ${({ theme }) => theme.lineHeights[0]};
  }
`;

const StyledLinkSubtitle = styled.span`
  font-size: ${({ theme }) => theme.fontSizes[1]};
  color: ${props => props.theme.colors.gray};
  font-weight: 300;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes[0]};
    line-height: ${({ theme }) => theme.lineHeights[0]};
  }
`;

type SubMenuProps = {
  links: Link[];
};

const SubMenu: React.FC<SubMenuProps> = ({ links }) => (
  <ul>
    {links.map(item => (
      <StyledMenuItem key={item.id}>
        <StyledLink href={item.url}>
          <StyledLinkTitle>{item.name}</StyledLinkTitle>
          <StyledLinkSubtitle>{item.description}</StyledLinkSubtitle>
        </StyledLink>
      </StyledMenuItem>
    ))}
  </ul>
);

type SolutionTitleProps = {
  title: string;
};

const SolutionTitle: React.FC<SolutionTitleProps> = ({ title }) => (
  <StyledTitleWrapper>
    <StyledTitle>{title}</StyledTitle>
    <StyledArrowIconWrapper>
      <IconArrowDown />
    </StyledArrowIconWrapper>
  </StyledTitleWrapper>
);

export { SolutionTitle, SubMenu, StyledArrowIconWrapper };
