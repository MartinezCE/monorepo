import { isFunction } from 'lodash';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useIsOutside, usePopup } from '../../hooks';

const StyledContainer = styled.div``;
const StyledChildrenContainer = styled.div`
  z-index: 1;
`;

type Props = {
  children: React.ReactNode | ((setShowPopup: React.Dispatch<React.SetStateAction<boolean>>) => React.ReactNode);
  container: React.ReactNode;
};

const Popup = ({ children, container }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isOutside } = useIsOutside({ ref: containerRef });
  const [showPopup, setShowPopup] = useState(false);

  const { popperConfig } = usePopup({ offset: [0, 14], placement: 'bottom' });

  useEffect(() => {
    if (isOutside) {
      setShowPopup(false);
    }
  }, [isOutside]);

  return (
    <div ref={containerRef}>
      <StyledContainer
        ref={(ref: SetStateAction<HTMLElement>) => popperConfig.setReferenceElement(ref)}
        onClick={() => setShowPopup(!showPopup)}>
        {container}
      </StyledContainer>
      {showPopup && (
        <StyledChildrenContainer
          ref={(ref: SetStateAction<HTMLElement>) => popperConfig.setPopperElement(ref)}
          style={popperConfig.styles.popper}
          {...popperConfig.attributes.popper}>
          {isFunction(children) ? children(setShowPopup) : children}
        </StyledChildrenContainer>
      )}
    </div>
  );
};

export default Popup;
