import { AuthLayout, useGetMe, images } from '@wimet/apps-shared';
import { UserRole } from '@wimet/apps-shared/src/utils';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import useAllowedPath from '../../hooks/useAllowedPath';
import { useContext } from '../../hooks/useContext';
import ExtraInfoArea from './ExtraInfoArea';

interface Props {
  children?: ReactNode;
  title?: string;
  className?: string;
  hideSidebarContent?: boolean;
}

export default function Layout({ children, title = 'Wimet | Clients', className, hideSidebarContent }: Props) {
  const { handleSidebarCollapse, appData } = useContext();
  const router = useRouter();
  const { data: user } = useGetMe();
  const isMember = user?.userRole?.value === UserRole.MEMBER;
  const allowedPath = useAllowedPath();

  return (
    <AuthLayout
      className={className}
      variant='blue'
      onClickProfile={() => router.push('/profile')}
      onClickDashboard={() => router.push('/dashboard')}
      hideSidebarContent={hideSidebarContent}
      links={[
        {
          text: 'Inicio',
          active: router.asPath === '/',
          href: '/',
          icon: <images.House />,
        },
        {
          text: 'Colaboradores',
          active: router.asPath === '/collaborators',
          href: '/collaborators',
          icon: <images.People />,
        },
        () => {
          const allowedTeams = allowedPath('/teams');

          return {
            text: 'Equipos',
            active: router.asPath === '/teams',
            href: !allowedTeams.allowed ? allowedTeams.redirect : '/teams',
            icon: <images.Dashboard />,
            hide: !allowedTeams.allowed,
          };
        },
        // {
        //   text: 'Dashboard',
        //   active: router.asPath === '/dashboard',
        //   href: '/dashboard',
        //   icon: <images.Info />,
        // },
        {
          text: 'Vista en vivo',
          active: router.asPath.startsWith('/spaces/live'),
          href: '/spaces/live',
          hide: !isMember,
          icon: <images.Eye />,
        },
        {
          text: 'Mi oficina',
          active: router.asPath.startsWith('/spaces/office'),
          href: '/spaces/office',
          hide: !isMember,
          icon: <images.Monitor />,
        },
        {
          text: 'Mi plan',
          active: router.asPath.startsWith('/my-plan'),
          href: '/myplan',
          hide: !isMember,
          icon: <images.Plans />,
        },
        {
          text: 'Reservas',
          active: router.asPath.startsWith('/bookings'),
          href: '/bookings',
          hide: isMember,
          icon: <images.Calendar />,
        },
        () => {
          const allowedSpaces = allowedPath('/spaces');

          return {
            text: 'Espacios',
            active: router.asPath.startsWith('/spaces'),
            icon: <images.Spaces />,
            href: !allowedSpaces.allowed ? allowedSpaces.redirect : '/spaces/office',
            hide: isMember || (!allowedSpaces.keepOnSidebar && !allowedSpaces.allowed),
            links: [
              {
                text: 'Mi oficina',
                active: router.asPath.startsWith('/spaces/office'),
                href: '/spaces/office',
              },
              {
                text: 'Vista en vivo',
                active: router.asPath.startsWith('/spaces/live'),
                href: '/spaces/live',
              },
            ],
          };
        },
        () => {
          const { redirect, allowed, keepOnSidebar } = allowedPath('/workplace-manager');
          const { allowed: allowedChilds, keepOnSidebar: keepOnSidebarChilds } = allowedPath('/workplace-manager/*');

          return {
            text: 'Workplace Manager',
            active: router.asPath.startsWith('/workplace-manager'),
            icon: <images.WorkplaceManager />,
            href: !allowed ? redirect : '/workplace-manager',
            hide: !keepOnSidebar && !allowed,
            hideChilds: !keepOnSidebarChilds && !allowedChilds,
            links: [
              {
                text: 'Locaciones',
                active: router.asPath.startsWith('/workplace-manager/locations'),
                href: '/workplace-manager/locations',
              },
              // {
              //   text: 'Facturación',
              //   active: router.asPath.startsWith('/workplace-manager/billing'),
              //   href: '/workplace-manager/billing',
              // },
              {
                text: 'Amenities',
                active: router.asPath.startsWith('/workplace-manager/amenities'),
                href: '/workplace-manager/amenities',
              },
            ],
          };
        },
        () => {
          const allowCompany = allowedPath('/company');

          return {
            text: 'Empresa',
            active: router.asPath.startsWith('/company'),
            icon: <images.Company />,
            href: !allowCompany.allowed ? allowCompany.redirect : '/company/account',
            hide: !allowCompany.keepOnSidebar && !allowCompany.allowed,
            links: [
              {
                text: 'Perfíl',
                active: router.asPath.startsWith('/company/account'),
                href: '/company/account',
              },
              // () => {
              //   const allowPayments = allowedPath('/company/payments');

              //   return {
              //     text: 'Métodos de pago',
              //     active: router.asPath === '/company/payments',
              //     href: !allowPayments.allowed ? allowPayments.redirect : '/company/payments',
              //     hide: !allowPayments.keepOnSidebar && !allowPayments.allowed,
              //   };
              // },
              // {
              //   text: 'Facturación',
              //   active: router.asPath.startsWith('/company/billing'),
              //   href: '/company/billing',
              // },
              {
                text: 'Integraciones',
                active: router.asPath.startsWith('/company/integrations'),
                href: '/company/integrations',
              },
            ],
          };
        },
        () => {
          const allowSurveys = allowedPath('/surveys');

          return {
            text: 'Encuestas',
            active: router.asPath.startsWith('/surveys'),
            icon: <images.Surveys />,
            href: !allowSurveys.allowed ? allowSurveys.redirect : '/surveys',
            hide: !allowSurveys.keepOnSidebar && !allowSurveys.allowed,
          };
        },
      ]}
      extraInfo={<ExtraInfoArea country={user?.companies[0].state.country?.name} />}
      isCollapsed={!!appData.isSidebarCollapsed}
      isLogged={!!user?.companies[0].name}
      profileName={`${user?.firstName} ${user?.lastName}` || ''}
      onCollapse={handleSidebarCollapse}
      title={title}>
      {children}
    </AuthLayout>
  );
}
