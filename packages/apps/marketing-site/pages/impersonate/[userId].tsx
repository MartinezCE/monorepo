import { getMe, GET_ME, LayoutBase, LoadingSpinner, useGetMe } from '@wimet/apps-shared';
import { AxiosRequestHeaders } from 'axios';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import styled from 'styled-components';
import useImpersonateUser from '../../hooks/api/useImpersonateUser';

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ImpersonatePage = () => {
  const { data: userData } = useGetMe();
  const { query, replace } = useRouter();
  const userId = query.userId as string;
  const enabled = !!(userData?.isWimetAdmin && userId);

  useImpersonateUser(userId, { enabled, onSuccess: user => replace(user.profileUrl), onError: () => replace('/') });

  useEffect(() => {
    if (enabled) return;
    replace('/');
  }, [enabled, replace]);

  return (
    <LayoutBase title='Wimet | Impersonate'>
      <StyledWrapper>
        <LoadingSpinner />
      </StyledWrapper>
    </LayoutBase>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const headers = ctx.req.headers as AxiosRequestHeaders;

  try {
    const user = await queryClient.fetchQuery(GET_ME, () => getMe(headers));

    if (!user) throw new Error('User not found');
    if (!user.isWimetAdmin) throw new Error('User is not a Wimet admin');

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (_) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
}

export default ImpersonatePage;
