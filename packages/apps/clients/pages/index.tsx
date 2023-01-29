import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useGetMe, UserStatus } from '@wimet/apps-shared';
import Layout from '../components/Layout';
import MainHero from '../components/Homepage/MainHero';
import OffersCards from '../components/Homepage/OffersCards';
import PendingApprovalModal from '../components/Homepage/PendingApprovalModal';

const StyledWrapper = styled.div`
  padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 75px;
  width: 100%;
`;

const StyledOffersCards = styled(OffersCards)`
  margin-top: 80px;
`;

const IndexPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { query } = useRouter();
  const { data: user } = useGetMe();

  useEffect(() => {
    if (user?.status === UserStatus.APPROVED) return;
    setShowModal(true);
  }, [query, user]);

  return (
    <Layout>
      <StyledWrapper>
        <MainHero />
        <StyledOffersCards />
      </StyledWrapper>
      {showModal && (
        <PendingApprovalModal
          onClose={() => setShowModal(false)}
          hrefWorkspaces={`${process.env.NEXT_PUBLIC_INDEX_URL}/discover?country=${user?.companies[0].state.country?.name}`}
          hrefDemo={process.env.NEXT_PUBLIC_DEMO_URL}
        />
      )}
    </Layout>
  );
};

export default IndexPage;
