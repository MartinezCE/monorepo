/* eslint-disable no-param-reassign */
import { useState, useRef, forwardRef } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Navigation, SwiperOptions } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { NavigationOptions } from 'swiper/types';
import { ArrowButton, FullscreenPictureModal, images, Link, SpaceFile } from '@wimet/apps-shared';
import { ChevronLeft, ChevronRight } from '../../../assets/images';

const StyledSwiperWrapper = styled.section`
  position: relative;
  width: 100%;
  height: 360px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 210px;
  }
`;

const StyledOverlayWrapper = styled.div`
  margin: 0 max(calc(((100% - 1440px) / 2) + 104px), 104px);
  max-width: 1440px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0px 10%;
  }
`;

type StyledArrowProps = {
  direction?: 'left' | 'right';
};

const StyledArrow = styled(ArrowButton)<StyledArrowProps>`
  position: absolute;
  top: calc(50% - 16px);
  ${({ direction }) => (!direction || direction === 'left' ? 'left: 0' : 'right: 0')};
  color: ${({ theme }) => theme.colors.white};
  z-index: 2;
  background: rgba(44, 48, 56, 0.4);
  height: 32px;
  width: 32px;
  padding: 0;

  &:hover,
  :active,
  :focus {
    background: rgba(44, 48, 56, 0.4);
    color: ${({ theme }) => theme.colors.white};
  }

  &:disabled {
    visibility: hidden;
  }
`;

const StyledSwiperComponent = styled(Swiper)`
  height: 100%;

  .swiper-slide {
    width: 608px;
  }
`;

const StyledLink = styled(Link)`
  position: absolute;
  left: 0;
  bottom: 0;
  transform: translateY(50%);
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 6px 16px;
  column-gap: 8px;
`;

type Props = {
  imageList: Array<SpaceFile>;
  tourUrl?: string;
};

const SpaceDetailsHeaderSwiper = forwardRef<HTMLSelectElement, Props>(({ imageList, tourUrl }, ref) => {
  const leftArrowRef = useRef<HTMLButtonElement>(null);
  const rightArrowRef = useRef<HTMLButtonElement>(null);
  const [imageClicked, setImageClicked] = useState<number | null>(null);

  const options: SwiperOptions = {
    modules: [Navigation],
    pagination: { clickable: true },
    navigation: { prevEl: leftArrowRef.current, nextEl: rightArrowRef.current },
    spaceBetween: 24,
    slidesPerView: 'auto',
  };

  return (
    <StyledSwiperWrapper ref={ref}>
      <StyledOverlayWrapper>
        <StyledArrow ref={leftArrowRef} leadingIcon={<ChevronLeft />} />
        <StyledArrow ref={rightArrowRef} leadingIcon={<ChevronRight />} direction='right' />
      </StyledOverlayWrapper>
      <StyledSwiperComponent
        {...options}
        onBeforeInit={swiper => {
          (swiper?.params?.navigation as NavigationOptions).prevEl = leftArrowRef.current;
          (swiper?.params?.navigation as NavigationOptions).nextEl = rightArrowRef.current;
        }}>
        {imageList.map((image, index) => (
          <SwiperSlide key={image.id}>
            <Image layout='fill' objectFit='cover' src={image.url} onClick={() => setImageClicked(index)} />
          </SwiperSlide>
        ))}
      </StyledSwiperComponent>
      <StyledOverlayWrapper>
        {tourUrl && (
          <StyledLink variant='outline' trailingIcon={<images.ChevronRight />} href={tourUrl} target='_blank'>
            Ver tour virtual
          </StyledLink>
        )}
      </StyledOverlayWrapper>
      {imageClicked !== null && (
        <FullscreenPictureModal
          onClose={() => setImageClicked(null)}
          imageList={imageList}
          imageClicked={imageClicked}
        />
      )}
    </StyledSwiperWrapper>
  );
});

export default SpaceDetailsHeaderSwiper;
