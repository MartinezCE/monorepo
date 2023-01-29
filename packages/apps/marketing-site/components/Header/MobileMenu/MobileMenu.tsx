import styled from 'styled-components';
import { Layout } from '../../mixins';
import { Logo } from '../../../assets/images';
import Collapsible from '../../UI/Collapsible';
import { HeaderApiResponse } from '../../../hooks/api/useGetHeader';
import { StyledDemoLink, StyledMenuLink } from '../../UI/HeaderLeftAreaMenu/commonStyle';
import { SolutionTitle, SubMenu } from '../../UI/HeaderLeftAreaMenu/SolutionsMenu';

const StyledWrapper = styled.div`
  height: calc(100vh - 80px);
  width: 100%;
  z-index: 999;
  background: ${({ theme }) => theme.colors.white};
  position: fixed;
  top: 80px;
  padding: 64px 16px 40px;
  overflow: auto;
  a {
    max-width: 186px;
    white-space: normal;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: max-content;
  min-height: 100%;
  ${Layout};
`;

const StyledMenuItem = styled.li`
  list-style: none;
  margin-bottom: 40px;
`;

const StyledFullLogoContainer = styled.div`
  height: 14px;
  width: 84px;
  margin-top: auto;
  align-self: flex-end;
`;

type MobileMenuProps = {
  data: HeaderApiResponse | undefined;
};

const MobileMenu: React.FC<MobileMenuProps> = ({ data }) => (
  <StyledWrapper>
    <StyledContainer>
      <ul>
        <StyledMenuItem>
          <StyledMenuLink href={data?.attributes.whyWimet.url}>{data?.attributes.whyWimet.name}</StyledMenuLink>
        </StyledMenuItem>
        <StyledMenuItem>
          <Collapsible header={<SolutionTitle title={data?.attributes.solutionMenu.name || ''} />} open={false}>
            <SubMenu links={data?.attributes.solutionMenu.links || []} />
          </Collapsible>
        </StyledMenuItem>
        <StyledMenuItem>
          <StyledMenuLink href={data?.attributes.weAreHiring.url}>{data?.attributes.weAreHiring.name}</StyledMenuLink>
        </StyledMenuItem>
        <StyledMenuItem>
          <StyledDemoLink href={data?.attributes.requestDemo.url}>{data?.attributes.requestDemo.name}</StyledDemoLink>
        </StyledMenuItem>
      </ul>
      <StyledFullLogoContainer>
        <Logo />
      </StyledFullLogoContainer>
    </StyledContainer>
  </StyledWrapper>
);

export default MobileMenu;
