import { AuthLayout, images, useGetMe } from '@wimet/apps-shared';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useContext } from '../../../hooks/useContext';

interface Props {
  children?: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Wimet | Partners' }: Props) {
  const { handleSidebarCollapse, appData } = useContext();
  const { data: user } = useGetMe();
  const router = useRouter();

  return (
    <AuthLayout
      links={[
        {
          text: 'Dashboard',
          active: router.asPath === '/',
          icon: <images.Dashboard />,
        },
        {
          text: 'Reservas',
          active: router.asPath.includes('/reservations'),
          icon: <images.Reservations />,
          href: '/reservations',
        },
        {
          text: 'Locaciones',
          active: router.asPath.includes('/locations'),
          icon: <images.House />,
          href: '/locations',
        },
        {
          text: 'Mensajes',
          active: router.asPath.includes('/messages'),
          icon: <images.Message />,
          href: '/messages',
        },
        {
          text: 'Administración',
          active: router.asPath.includes('/financial'),
          icon: <images.Money />,
          href: '/financial',
        },
        {
          text: 'Staff',
          active: router.asPath.includes('/staff'),
          icon: <images.Staff />,
          href: '/staff',
        },
      ]}
      isCollapsed={!!appData.isSidebarCollapsed}
      isLogged={!!user?.companies[0].name}
      profileName={user?.companies[0].name || ''}
      onCollapse={handleSidebarCollapse}
      onClickProfile={() => router.push('/profile')}
      onClickDashboard={() => router.push('/')}
      title={title}>
      {children}
    </AuthLayout>
  );
}
