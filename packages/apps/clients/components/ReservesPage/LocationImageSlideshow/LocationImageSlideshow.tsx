/* eslint-disable no-param-reassign */
import React, { useRef, useState } from 'react';
import { ArrowButton, FullscreenPictureModal, images, LocationFile } from '@wimet/apps-shared';
import styled from 'styled-components';
import { Navigation, SwiperOptions } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { NavigationOptions } from 'swiper/types/modules/navigation';
import Image from 'next/image';

const StyledWrapper = styled.div`
  margin-top: 65px;
`;

const StyledTitle = styled.div`
  color: ${({ theme }) => theme.colors.extraDarkBlue};
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 32px;
`;

const StyledSwiperWrapper = styled.section`
  margin-top: 32px;
  position: relative;
  width: 100%;
  height: 135px;
`;

const StyledOverlayWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
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
  & .swiper-wrapper {
    height: 100%;
  }

  & .swiper-slide {
    width: 237.25px;
    & span {
      border-radius: 4px;
    }
  }
`;

type Props = {
  imageList: Array<LocationFile>;
};

const LocationImageSlideshow = ({ imageList }: Props) => {
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
    <StyledWrapper>
      <StyledTitle>Imágenes</StyledTitle>
      <StyledSwiperWrapper>
        <StyledOverlayWrapper>
          <StyledArrow ref={leftArrowRef} leadingIcon={<images.ChevronLeft />} />
          <StyledArrow ref={rightArrowRef} leadingIcon={<images.ChevronRight />} direction='right' />
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

        {imageClicked !== null && (
          <FullscreenPictureModal
            onClose={() => setImageClicked(null)}
            imageList={imageList}
            imageClicked={imageClicked}
          />
        )}
      </StyledSwiperWrapper>
    </StyledWrapper>
  );
};

export default LocationImageSlideshow;
