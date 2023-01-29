/* eslint-disable no-param-reassign */
import { useRef } from 'react';
import styled, { css } from 'styled-components';
import { Navigation, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { NavigationOptions } from 'swiper/types';
import { ArrowButton, DotsPattern } from '@wimet/apps-shared';
import Label from '../../UI/Label';
import { ChevronLeft, ChevronRight } from '../../../assets/images';
import { Layout } from '../../mixins';
import { BlockTestimonials } from '../../../interfaces/api';
import { getImageProps } from '../../../utils/images';

const StyledWrapper = styled.div`
  ${Layout}
  width: 100%;
`;

const StyledInnerWrapper = styled.div`
  position: relative;
`;

type StyledArrowProps = {
  direction?: 'left' | 'right';
};

const StyledArrow = styled(ArrowButton)<StyledArrowProps>`
  position: absolute;
  top: 50%;
  z-index: 2;
  ${({ direction }) =>
    !direction || direction === 'left'
      ? css`
          left: 0;
          transform: translateX(-50%);
        `
      : css`
          left: 100%;
          transform: translateX(-50%);
        `};

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 28px;
    height: 28px;
    top: 70px;
    transform: translateY(-50%);
    padding: 0;

    ${({ direction }) =>
      !direction || direction === 'left'
        ? css`
            left: 24px;
          `
        : css`
            left: unset;
            right: 24px;
          `};
  }
`;

const StyledChevronLeft = styled(ChevronLeft)`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transform: scale(0.9);
  }
`;

const StyledChevronRight = styled(ChevronRight)`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transform: scale(0.9);
  }
`;

const StyledSwiper = styled(Swiper)`
  border-radius: 10px;
  overflow: hidden;

  .swiper-slide {
    margin: auto;
  }
`;

const StyledTestimonialBackground = styled(SwiperSlide)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  background-color: ${({ theme }) => theme.colors.extraLightGray};
  border-radius: 10px;
  overflow: hidden;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    top: 70px;
    height: calc(100% - 70px);
  }
`;

const StyledTestimonialWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 130px 118px;
  padding-right: 69px;
  row-gap: 32px;
  column-gap: 90px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding-left: 69px;
    column-gap: 60px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    width: 100%;
    padding: 0 24px;
    padding-bottom: 106px;
    justify-items: center;
  }
`;

const StyledWrapperAvatar = styled.div`
  height: 100%;
  width: 225px;
  height: 225px;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    width: 140px;
    height: 140px;
  }
`;

const StyledRightSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    align-items: center;
    text-align: center;
  }
`;

const StyledText = styled.h6`
  max-width: 600px;
  margin-bottom: 32px;
  margin-top: 14px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: ${({ theme }) => theme.fontSizes[4]};
    line-height: ${({ theme }) => theme.lineHeights[2]};
    font-weight: 300;
    max-width: 400px;
  }
`;

const StyledSeparator = styled.div`
  width: 35px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.blue};
  margin-bottom: 14px;
`;

const StyledLabel = styled(Label)`
  font-size: 16px;
  text-transform: none;
  color: ${({ theme }) => theme.colors.extraDarkBlue};
  margin-bottom: 5px;
`;

const StyledDotPattern = styled(DotsPattern)`
  position: absolute;
  right: -90px;
  bottom: 0;
  z-index: 1;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: 8px;
    right: 0;
    bottom: -42px;

    > div {
      width: 4px;
      height: 4px;
    }
  }
`;

type Props = BlockTestimonials;

export default function Testimonials({ testimonails }: Props) {
  const leftArrowRef = useRef<HTMLButtonElement>(null);
  const rightArrowRef = useRef<HTMLButtonElement>(null);

  return (
    <StyledWrapper data-aos='fade-up'>
      <StyledInnerWrapper>
        <StyledArrow ref={leftArrowRef} leadingIcon={<StyledChevronLeft />} />
        <StyledArrow ref={rightArrowRef} leadingIcon={<StyledChevronRight />} direction='right' />
        <StyledSwiper
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 5000 }}
          loop
          speed={500}
          navigation={{ prevEl: leftArrowRef.current, nextEl: rightArrowRef.current }}
          onBeforeInit={swiper => {
            (swiper?.params?.navigation as NavigationOptions).prevEl = leftArrowRef.current;
            (swiper?.params?.navigation as NavigationOptions).nextEl = rightArrowRef.current;
          }}>
          {testimonails?.map(({ id, avatar, companyLogo, fullName, companyName, quote, jobPosition }) => (
            <SwiperSlide key={id}>
              <StyledTestimonialBackground />
              <StyledTestimonialWrapper>
                <StyledWrapperAvatar>
                  <Image {...getImageProps(avatar, 'fill')} />
                </StyledWrapperAvatar>
                <StyledRightSide>
                  <Image {...getImageProps(companyLogo, 'fixed')} objectFit='contain' />
                  <StyledText>“{quote}”</StyledText>
                  <StyledSeparator />
                  <StyledLabel text={fullName} />
                  <p>
                    {jobPosition} at {companyName}
                  </p>
                </StyledRightSide>
              </StyledTestimonialWrapper>
            </SwiperSlide>
          ))}
        </StyledSwiper>
        <StyledDotPattern />
      </StyledInnerWrapper>
    </StyledWrapper>
  );
}
