import { useGetMe, UserRole } from '@wimet/apps-shared';
import styled from 'styled-components';
import AdminBookings from '../../../components/BookingsPage/AdminBookings';
import Layout from '../../../components/Layout';
import MemberBookings from '../../../components/BookingsPage/MemberBookings';

const StyledWrapper = styled.div`
  display: flex;
  margin: 72px 20px 72px 72px;
`;

export default function BookingsPage() {
  const { data: user } = useGetMe();
  return (
    <Layout>
      {user?.userRole?.value === UserRole.MEMBER ? (
        <MemberBookings />
      ) : (
        <StyledWrapper>
          <AdminBookings />
        </StyledWrapper>
      )}
    </Layout>
  );
}
