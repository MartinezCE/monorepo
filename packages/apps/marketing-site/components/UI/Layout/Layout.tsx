import { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { AuthHeader, LayoutBase, LayoutVariant, useGetMe, images, api } from '@wimet/apps-shared';
import { useRouter } from 'next/router';
import Footer from '../../Footer';
import { Locale } from '../../../interfaces/api';
import Header from '../../Header';
import { IconHiringTag } from '../../../assets/images';
import useGetHeader, { HeaderApiResponse } from '../../../hooks/api/useGetHeader';
import HeaderLeftAreaMenu from '../HeaderLeftAreaMenu';

type StyledLayoutBaseProps = {
  isHeaderFixed?: boolean;
};

const StyledLayoutBase = styled(LayoutBase)<StyledLayoutBaseProps>`
  padding: initial;
  background: initial;
  overflow: initial;
  flex-direction: column;

  ${({ isHeaderFixed }) =>
    isHeaderFixed &&
    css`
      padding-top: ${({ theme }) => theme.heights.header};
    `}
`;

const IconHiring = styled(IconHiringTag)`
  margin-left: 10px;
  margin-top: 1px;
`;

const config = {
  PARTNER: 'orange',
  CLIENT: 'blue',
};

type Props = {
  children?: ReactNode;
  title?: string;
  className?: string;
  isFixed?: boolean;
  isFluid?: boolean;
} & Locale;

export default function Layout({ children, title, locale, className, isFixed = true, isFluid = true }: Props) {
  const router = useRouter();
  const { data: user, isError } = useGetMe({
    retry: false,
  });
  const menuUrls = {
    PARTNER: {
      profile: `${user?.profileUrl}/profile`,
      dashboard: `${user?.profileUrl}/`,
    },
    CLIENT: {
      profile: `${user?.profileUrl}/profile`,
      dashboard: `${user?.profileUrl}/dashboard`,
    },
  };
  const handleLogout = async () => {
    api.post('/auth/sign-out').then(() => router.replace(`${process.env.NEXT_PUBLIC_LOGIN_URL}`));
  };
  const { data: headerData = {} as HeaderApiResponse } = useGetHeader({ locale });
  return (
    <StyledLayoutBase
      className={className}
      title={title}
      isHeaderFixed={isFixed}
      customHeader={
        user && !isError ? (
          <AuthHeader
            profileName={`${user?.firstName} ${user?.lastName}` || ''}
            variant={config[(user?.userType?.value || '') as keyof typeof config] as LayoutVariant}
            isLogged
            isFixed={isFixed}
            noAbsolute
            logoExtra={<IconHiring />}
            hreflogoExtra='https://bit.ly/trabajar-en-wimet'
            leftContent={<HeaderLeftAreaMenu data={headerData} />}
            onClickProfile={() => router.replace(menuUrls[user.userType.value].profile)}
            onClickDashboard={() => router.replace(menuUrls[user.userType.value].dashboard)}
            links={[
              {
                text: 'Dashboard',
                icon: <images.House />,
                onClick: () => router.replace(menuUrls[user.userType.value].dashboard),
              },
              {
                text: 'Perfil',
                icon: <images.Dashboard />,
                onClick: () => router.replace(menuUrls[user.userType.value].profile),
              },
              {
                text: 'Cerrar sesión',
                icon: <images.Dashboard />,
                active: true,
                onClick: handleLogout,
              },
            ]}
          />
        ) : (
          <Header data={headerData} locale={locale} isFixed={isFixed} isFluid={isFluid} />
        )
      }>
      {children}
      <Footer locale={locale} isFluid={isFluid} />
    </StyledLayoutBase>
  );
}
