import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { StyledArrowIconWrapper } from '../HeaderLeftAreaMenu/SolutionsMenu/SolutionsMenu';

const StyledContent = styled.div<{ isOpen: boolean }>`
  overflow: hidden;
  transition: height 0.2s ease-in-out;
`;

type StyledHeaderContentProps = {
  isOpen?: boolean;
};

const StyledHeaderContent = styled.div<StyledHeaderContentProps>`
  ${({ isOpen }) =>
    isOpen &&
    css`
      ${StyledArrowIconWrapper} {
        transform: rotate(180deg);
      }
    `}
`;

type CollapsibleProps = {
  header: string | React.ReactNode;
  open: boolean;
};

const Collapsible: React.FC<CollapsibleProps> = ({ header, open, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(open);
  const [height, setHeight] = useState<number | undefined>(open ? undefined : 0);

  useEffect(() => {
    if (isOpen) setHeight(ref.current?.getBoundingClientRect().height);
    else setHeight(0);
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <StyledHeaderContent onClick={handleClick} isOpen={isOpen}>
        {header}
      </StyledHeaderContent>
      <StyledContent isOpen={isOpen} style={{ height, marginTop: height ? '24px' : 0 }}>
        <div ref={ref}>{isOpen && children}</div>
      </StyledContent>
    </>
  );
};

export default Collapsible;
