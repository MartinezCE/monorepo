import React, { DependencyList, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const StyledContent = styled.div<{ isOpen: boolean }>`
  overflow: hidden;
  transition: height 0.2s ease-in-out;
`;

type CollapsibleProps = {
  isOpen?: boolean;
  className?: string;
  deps?: DependencyList[];
};

const Collapsible: React.FC<CollapsibleProps> = ({ isOpen = false, children, className, deps = [] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0);

  useEffect(() => {
    if (isOpen) setHeight(ref.current?.getBoundingClientRect().height);
    else setHeight(0);
  }, [isOpen, deps]);

  return (
    <StyledContent isOpen={isOpen} style={{ height }} className={className}>
      <div ref={ref}>{children}</div>
    </StyledContent>
  );
};

export default Collapsible;
