import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { CustomTab } from '../../CustomTabs/CustomTabs';

const getBaseTabs = (id: string) => [
  {
    href: `/teams/${id}/general`,
    title: 'General',
  },
  {
    href: `/teams/${id}/collaborators`,
    title: 'Colaboradores',
  },
  {
    href: `/teams/${id}/licenses`,
    title: 'Permisos',
  },
];

export const useTeamTabs = (teamId: string): [CustomTab[]] => {
  const router = useRouter();

  const tabs = useMemo(
    () =>
      getBaseTabs(teamId).map(t => ({
        ...t,
        isActive: router.asPath.includes(t.href),
      })),
    [router.asPath, teamId]
  );

  return [tabs];
};
