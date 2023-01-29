import { useGetMe } from '@wimet/apps-shared';
import { useEffect } from 'react';
import { useIntercom } from 'react-use-intercom';

export const useLoggedIntercom = () => {
  const { boot, shutdown, update } = useIntercom();
  const { data: userData, isRefetchError, isFetchedAfterMount } = useGetMe();

  useEffect(() => {
    if (userData && !isRefetchError) {
      if (isFetchedAfterMount) boot();
      const { id, firstName, lastName, email, createdAt } = userData;
      update({ userId: `${id}`, name: `${firstName} ${lastName}`, email, createdAt });
    } else {
      shutdown();
      boot();
    }
  }, [boot, shutdown, update, userData, isRefetchError, isFetchedAfterMount]);
};
