import styled from 'styled-components';
import { useRouter } from 'next/router';
import { SpaceBaseLayout } from '@wimet/apps-shared';
import { useTeamTabs } from './hooks/useTeamTabs';
import Layout from '../Layout';
import useGetCompanyTeam from '../../hooks/api/useGetCompanyTeam';
import CustomTabs from '../CustomTabs';

const HeaderLayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2.5em;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1.5em;
  padding: 1.5em 0;
`;

const Title = styled.p`
  font-size: 2.2em;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.black};
`;

export type TeamPageLayoutProps = {
  children: React.ReactNode;
};

const TeamPageLayout = ({ children }: TeamPageLayoutProps) => {
  const router = useRouter();
  const [tabs] = useTeamTabs(router.query.teamId as string);
  const { data: team } = useGetCompanyTeam(router.query.teamId as string);

  return (
    <Layout title='Wimet | Members'>
      <SpaceBaseLayout backLinkHref='/teams' backLinkTitle='Equipos'>
        <HeaderLayoutWrapper>
          <Header>
            <Title>{team?.name}</Title>
            <CustomTabs tabs={tabs} />
          </Header>
          {children}
        </HeaderLayoutWrapper>
      </SpaceBaseLayout>
    </Layout>
  );
};

export default TeamPageLayout;
