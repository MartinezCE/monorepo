import { ClientLocation, useGetMe, User, UserRole, UserStatus } from '@wimet/apps-shared';
import { isMatch } from 'matcher';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import useGetAllClientLocations from './api/useGetAllClientLocations';

export type Blacklist = {
  [key in UserRole]?: string[];
};

export const blacklist: Blacklist = {
  [UserRole.MEMBER]: [
    // TODO: Remove the following lines when the feature is ready
    '/workplace-manager',
    '/pass',
    '/company',
    '/payments',
    '/surveys',
    '/teams',
  ],
  [UserRole.ACCOUNT_MANAGER]: [
    '/my-plan',
    // TODO: Remove the following lines when the feature is ready
  ],
  [UserRole.TEAM_MANAGER]: [
    // TODO: Remove the following lines when the feature is ready
    '/my-plan',
    '/spaces',
    '/company',
    '/surveys',
    '/teams',
  ],
};

const opts = { allowed: true, keepOnSidebar: true, redirect: '/' };

const isInBlackList = (role: UserRole, path: string) => {
  if (blacklist[role]?.some(p => path.includes(p))) {
    return { ...opts, allowed: false, keepOnSidebar: false, redirect: '/' };
  }

  return opts;
};

const isApprovedUser = (user: User, path: string) => {
  const EXCLUDED_PATH = '/';

  if (user.status === UserStatus.APPROVED) return opts;
  if (isMatch(path, EXCLUDED_PATH)) return opts;
  return { ...opts, allowed: false, redirect: EXCLUDED_PATH };
};

const isWPMAllowed = (user: User, locations: ClientLocation[], path: string) => {
  const WPM = '/workplace-manager';
  const WPM_LOCATIONS = '/workplace-manager/locations';
  const WPM_LOCATIONS_NEW = '/workplace-manager/locations/new';

  if (!path.startsWith(WPM)) return opts;

  if (isMatch(path, WPM)) {
    if (!user.isWPMEnabled && !locations.length) return opts;
    return { ...opts, allowed: false, redirect: WPM_LOCATIONS };
  }

  if (user.isWPMEnabled) return opts;

  if (isMatch(path, WPM_LOCATIONS)) {
    if (locations.length) return opts;
    return { ...opts, allowed: false, redirect: WPM };
  }

  if (isMatch(path, WPM_LOCATIONS_NEW)) {
    if (!locations.length) return opts;
    return { ...opts, allowed: false, redirect: WPM_LOCATIONS };
  }

  return { ...opts, allowed: false, keepOnSidebar: false, redirect: WPM_LOCATIONS };
};

type Props = {
  user: User;
  locations: ClientLocation[];
  path: string;
};

export const isAllowedPath = ({ user, locations, path }: Props): typeof opts => {
  const blacklistResult = isInBlackList(user.userRole?.value as UserRole, path);
  const approvedUserResult = isApprovedUser(user, path);
  const wpmResult = isWPMAllowed(user, locations, path);

  if (!blacklistResult.allowed) return blacklistResult;
  if (!approvedUserResult.allowed) return approvedUserResult;
  if (!wpmResult.allowed) return wpmResult;
  return opts;
};

export default function useAllowedPath() {
  const { data: user } = useGetMe();
  const { data: locations = [] } = useGetAllClientLocations();

  return (path: string): typeof opts => {
    if (!user) return { ...opts, allowed: false, keepOnSidebar: false };
    return isAllowedPath({ user, locations, path });
  };
}

export const AllowedPathRouteChecker = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const allowedPath = useAllowedPath();

  const beforeHistoryChange = useCallback(
    async (asPath: string) => {
      const { allowed, redirect } = allowedPath(asPath);
      if (!allowed) router.replace(redirect);
    },
    [allowedPath, router]
  );

  useEffect(() => {
    router.events.on('beforeHistoryChange', beforeHistoryChange);
    return () => router.events.off('beforeHistoryChange', beforeHistoryChange);
  }, [beforeHistoryChange, router.events]);

  return <>{children}</>;
};
