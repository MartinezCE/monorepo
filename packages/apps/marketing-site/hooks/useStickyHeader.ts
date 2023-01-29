import { useEffect, useState } from 'react';

type UseSickyHeaderProps = {
  headerWidth: number;
};

const useStickyHeader = ({ headerWidth }: UseSickyHeaderProps) => {
  const [showStickyHeader, setShowStickyHeader] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= headerWidth && !showStickyHeader) {
        setShowStickyHeader(true);
      } else {
        setShowStickyHeader(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { showStickyHeader };
};

export default useStickyHeader;
