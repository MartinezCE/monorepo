import { useState } from 'react';
import { PopperProps, usePopper } from 'react-popper';
import { Placement } from '@popperjs/core';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  popperProps?: PopperProps<any>;
  offset?: [number, number];
  hide?: boolean;
  placement?: Placement;
};

const usePopup = ({ popperProps, offset = [0, 5], hide = true, placement = 'bottom-start' } = {} as Props) => {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);

  const { styles, attributes, ...popper } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset,
        },
      },
      {
        name: 'hide',
        enabled: hide,
      },
    ],
    placement,
    strategy: 'fixed',
    ...popperProps,
  });

  return {
    popperConfig: {
      popperElement,
      setPopperElement,
      referenceElement,
      setReferenceElement,
      styles,
      attributes,
    },
    ...popper,
  };
};

export default usePopup;
