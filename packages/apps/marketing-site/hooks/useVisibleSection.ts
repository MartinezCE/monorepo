import { MutableRefObject, useCallback, useEffect, useState } from 'react';

type SectionsRef = (HTMLElement | HTMLElement[] | null)[];

type UseVisibleSectionProps = {
  sections: MutableRefObject<SectionsRef>;
  scrollPositionToCheck: number;
  gap?: number;
};

const useVisibleSection = ({ sections, scrollPositionToCheck, gap = 0 }: UseVisibleSectionProps) => {
  const [visibleSection, setVisibleSection] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + scrollPositionToCheck;
      const elementInViewPortIndex = sections.current.findIndex(section => {
        if (!section) return false;
        let height = 0;
        if (Array.isArray(section)) {
          height = section.reduce((acc, curr) => acc + curr.getBoundingClientRect().height, height);
        } else {
          height = section.getBoundingClientRect().height;
        }
        const offsetTop = Array.isArray(section)
          ? section[0].getBoundingClientRect().top
          : section.getBoundingClientRect().top;
        const offsetBottom = offsetTop + height;
        return scrollPosition > offsetTop && scrollPosition < offsetBottom;
      });

      if (elementInViewPortIndex === visibleSection) return;
      setVisibleSection(elementInViewPortIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollPositionToCheck, sections, visibleSection, gap]);

  const handleClickHeaderItem = useCallback(
    (id: number) => {
      const sectionsList = sections.current;
      const clickedSection = sectionsList.find((_, sectionIndex) => sectionIndex === id);
      if (!clickedSection) return;

      const y =
        (Array.isArray(clickedSection)
          ? clickedSection[0].getBoundingClientRect().top
          : clickedSection?.getBoundingClientRect().top) +
        window.pageYOffset -
        79;
      window.scrollTo({ top: y, behavior: 'smooth' });
    },
    [sections]
  );

  return { visibleSection, handleClickHeaderItem };
};

export default useVisibleSection;
