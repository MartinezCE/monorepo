/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';

type Props = {
  width: number;
  withListeners?: boolean;
};

const useMediaQuery = ({ width, withListeners }: Props) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = (e: MediaQueryListEvent) => setTargetReached(e.matches);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    setTargetReached(media.matches);

    if (!withListeners) return;

    media.addEventListener('change', updateTarget);
    return () => media.removeEventListener('change', updateTarget);
  }, [width, withListeners]);

  return targetReached;
};

export default useMediaQuery;
