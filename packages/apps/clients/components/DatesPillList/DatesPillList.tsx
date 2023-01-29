import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pill, Button, images } from '@wimet/apps-shared';
import styled, { css } from 'styled-components';
import { format } from 'date-fns';

type StyledOverflowingProps = {
  isOverflowing: boolean;
};

const StyledWrapper = styled.div<StyledOverflowingProps>`
  position: relative;
  overflow-x: hidden;
  margin-left: 43px;
  margin-right: 32px;
  flex: 1;
  &:after {
    visibility: ${({ isOverflowing }) => (isOverflowing ? 'visible' : 'hidden')};
    pointer-events: none; /* ignore clicks */
    content: '';
    position: absolute;
    z-index: 1;
    height: 100%;
    left: 0;
    bottom: 0;
    width: 100%;
    background: linear-gradient(
      90deg,
      rgba(248, 248, 248, 1) 5%,
      rgba(248, 248, 248, 0) 15%,
      rgba(248, 248, 248, 0) 85%,
      rgba(248, 248, 248, 1) 95%
    );
  }
`;

const StyledAvaliabilityList = styled.div<StyledOverflowingProps>`
  width: 100%;
  display: flex;
  flex-flow: row-reverse;
  overflow-x: auto;
  column-gap: 16px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    background: transparent; /* Chrome/Safari/Webkit */
    display: none;
  }
  & > div:first-child {
    margin-right: ${({ isOverflowing }) => (isOverflowing ? '50px' : '0')};
  }
  & > div:last-child {
    margin-left: ${({ isOverflowing }) => (isOverflowing ? '50px' : '0')};
  }
`;

const StyledPill = styled(Pill)`
  background-color: ${({ theme }) => theme.colors.lighterGray};
`;

const StyledButtonConfig = css<StyledOverflowingProps>`
  visibility: ${({ isOverflowing }) => (isOverflowing ? 'visible' : 'hidden')};
  position: absolute;
  top: 0;
  z-index: 2;
  margin: 0;
  bottom: 0;
  color: ${({ theme }) => theme.colors.gray};
`;

const StyledLeftButton = styled(Button)<StyledOverflowingProps>`
  ${StyledButtonConfig}
  left: 0;
`;

const StyledRightButton = styled(Button)<StyledOverflowingProps>`
  ${StyledButtonConfig}
  right: 0;
`;

const BASE_SCROLL_WIDTH = 50;

type Props = {
  dates: Date[];
};

// TODO: migrate this component to Swipper component
const DatesPillList = ({ dates = [] }: Props) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isMouseHover, setIsMouseHover] = useState(false);
  const mainWrapperRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((direction: string) => {
    if (mainWrapperRef && mainWrapperRef.current) {
      const mainElement = mainWrapperRef.current;
      if (direction === 'left') {
        mainElement.scrollLeft += BASE_SCROLL_WIDTH;
      } else {
        mainElement.scrollLeft -= BASE_SCROLL_WIDTH;
      }
    }
  }, []);

  const handleWheelScroll = useCallback(
    (e: WheelEvent) => {
      if (isMouseHover) {
        if (e.deltaY > 0) {
          handleScroll('left');
        } else {
          handleScroll('right');
        }
      }
    },
    [handleScroll, isMouseHover]
  );

  const handleResize = useCallback(() => {
    if (mainWrapperRef && mainWrapperRef.current) {
      const mainElement = mainWrapperRef.current;
      const elementIsOverflowing =
        mainElement.clientWidth < mainElement.scrollWidth || mainElement.clientHeight < mainElement.scrollHeight;

      if (elementIsOverflowing !== isOverflowing) {
        setIsOverflowing(elementIsOverflowing);
      }
    }
  }, [isOverflowing]);

  useEffect(() => {
    handleResize();
    window.addEventListener('wheel', handleWheelScroll);
    window.addEventListener('resize', handleResize);

    const mainElement = mainWrapperRef.current;
    if (mainElement) {
      mainElement.addEventListener('mouseleave', () => setIsMouseHover(false), false);
      mainElement.addEventListener('mouseover', () => setIsMouseHover(true), false);
    }

    return () => {
      window.removeEventListener('wheel', handleWheelScroll);
      window.removeEventListener('resize', handleResize);
      if (mainElement) {
        mainElement.removeEventListener('mouseleave', () => setIsMouseHover(false), false);
        mainElement.removeEventListener('mouseover', () => setIsMouseHover(true), false);
      }
    };
  }, [handleWheelScroll, handleResize, isMouseHover]);

  return (
    <StyledWrapper isOverflowing={isOverflowing}>
      <StyledLeftButton variant='transparent' onClick={() => handleScroll('left')} isOverflowing={isOverflowing}>
        <images.ChevronLeft />
      </StyledLeftButton>
      <StyledAvaliabilityList ref={mainWrapperRef} isOverflowing={isOverflowing}>
        {dates.map(date => (
          <StyledPill
            hideRemoveButton
            key={date.toUTCString()}
            text={format(date, 'dd-MM-yyyy')}
            onClickClose={() => {}}
          />
        ))}
      </StyledAvaliabilityList>
      <StyledRightButton variant='transparent' onClick={() => handleScroll('right')} isOverflowing={isOverflowing}>
        <images.LightChevronRight />
      </StyledRightButton>
    </StyledWrapper>
  );
};

export default DatesPillList;
