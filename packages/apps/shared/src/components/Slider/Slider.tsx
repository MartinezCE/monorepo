import React from 'react';
import ReactSlider, { SliderProps } from 'rc-slider';

import raf from 'rc-util/lib/raf';
import Tooltip from 'rc-tooltip';
import styled from 'styled-components';
import { useField } from 'formik';
import { theme } from '../../common';
import { getError } from '../../utils';
import ErrorText from '../ErrorText';

const StyledReactSlider = styled(ReactSlider)`
  margin-top: 54px;

  & .rc-slider-mark-text {
    color: ${props => props.theme.colors.sky};
    font-size: 16px;
    font-weight: 200;
  }

  & .rc-slider-handle {
    opacity: 1;
  }

  & .rc-slider-step {
    display: none;
  }

  & .rc-slider-mark-text {
    top: -44px;
  }
`;

const StyledErrorWrapper = styled.div`
  margin-top: 12px;
`;

const HandleTooltip = (props: {
  value: number;
  children: React.ReactElement;
  visible: boolean;
  containerRef: React.MutableRefObject<HTMLElement>;
  tipFormatter?: (value: number) => React.ReactNode;
}) => {
  const { value, children, visible, containerRef, tipFormatter = val => `${val}`, ...restProps } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tooltipRef = React.useRef<any>();
  const rafRef = React.useRef<number | null>(null);

  function cancelKeepAlign() {
    raf.cancel(rafRef.current);
  }

  function keepAlign() {
    rafRef.current = raf(() => {
      tooltipRef.current?.forcePopupAlign();
    });
  }

  React.useEffect(() => {
    if (visible) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }

    return cancelKeepAlign;
  }, [value, visible]);

  return (
    <Tooltip
      showArrow={false}
      placement='top'
      overlay={tipFormatter(value)}
      overlayInnerStyle={{
        height: 36,
        width: 80,
        borderRadius: 36,
        background: theme.colors.blue,
        color: 'white',
        fontSize: 17,
        fontWeight: 500,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      ref={tooltipRef}
      getTooltipContainer={() => document.getElementsByClassName('rc-slider')[0] as HTMLElement}
      visible
      {...restProps}>
      {children}
    </Tooltip>
  );
};

// TODO: tipHandleRender: SliderProps['handleRender']
const tipHandleRender = (node, handleProps, tipFormatter, tipProps, sliderRef) => (
  <HandleTooltip
    value={handleProps.value}
    visible={handleProps.dragging}
    tipFormatter={tipFormatter}
    {...tipProps}
    containerRef={sliderRef}>
    {node}
  </HandleTooltip>
);

const Slider = ({
  tipFormatter,
  tipProps,
  ...props
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
SliderProps & { name?: string; tipFormatter?: (value: number) => React.ReactNode; tipProps: any }) => {
  const sliderRef = React.useRef();
  const [field, meta, helpers] = useField(props?.name);

  const error = meta.touched ? getError(meta.error) : undefined;

  return (
    <>
      <StyledReactSlider
        ref={sliderRef}
        onChange={value => helpers.setValue(value)}
        {...props}
        handleRender={(node, handleProps) => tipHandleRender(node, handleProps, tipFormatter, tipProps, sliderRef)}
        trackStyle={{ backgroundColor: theme.colors.blue, height: 10 }}
        railStyle={{ backgroundColor: '#EFF0F7', height: 10 }}
        value={field.value}
        defaultValue={field.value}
        handleStyle={{
          borderColor: '#D9DBE9',
          height: 23,
          width: 23,
          marginTop: -7,
        }}
      />
      {error && (
        <StyledErrorWrapper>
          <ErrorText>{error}</ErrorText>
        </StyledErrorWrapper>
      )}
    </>
  );
};

export default Slider;
