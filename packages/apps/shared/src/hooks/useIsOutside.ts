import { useEffect, useState } from 'react';

type Props = {
  ref: React.RefObject<HTMLElement>;
};

const useIsOutside = ({ ref }: Props) => {
  const [isOutside, setIsOutside] = useState(false);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
        setIsOutside(true);
      } else {
        setIsOutside(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return { isOutside };
};

export default useIsOutside;
