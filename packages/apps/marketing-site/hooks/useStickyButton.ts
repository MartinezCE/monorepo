import { useEffect, useState } from 'react';

const useStickyButton = (limit: number) => {
  const [showStickyButton, setShowStickyButton] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY <= document.body.offsetHeight - limit && !showStickyButton) {
        setShowStickyButton(true);
      } else {
        setShowStickyButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { showStickyButton };
};

export default useStickyButton;
