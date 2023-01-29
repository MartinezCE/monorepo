import Image from 'next/image';
import { useRef } from 'react';
import styled from 'styled-components';
import { Navigation, SwiperOptions } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ArrowButton, BreakpointBox } from '@wimet/apps-shared';
import { ChevronLeft, ChevronRight } from '../../../assets/images';
import { Layout } from '../../mixins';
import Label from '../../UI/Label';
import Link from '../../UI/Link';
import { BlockImageList } from '../../../interfaces/api';
import { getImageProps } from '../../../utils/images';

const StyledWrapper = styled.div`
  position: relative;
  padding-top: 84px;
  padding-bottom: 56px;
`;

const StyledArrowWrapper = styled.div`
  ${Layout}
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const StyledInnerArrowWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

type StyledArrowProps = {
  direction?: 'left' | 'right';
};

const StyledArrow = styled(ArrowButton)<StyledArrowProps>`
  width: 28px;
  height: 28px;
  position: absolute;
  top: 190px;
  ${({ direction }) => (!direction || direction === 'left' ? 'left: 0' : 'right: 0')};
  padding: 0;
  z-index: 2;
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
  .swiper-slide {
    height: auto;
  }
`;

const StyledSlide = styled.div`
  ${Layout}
  width: 100%;
  height: 100%;
  max-width: 365px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StyledLabel = styled(Label)`
  width: 100%;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: 32px;
  }
`;

const StyledImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  margin-bottom: 20px;
`;

const StyledTitle = styled.h4`
  margin-bottom: 16px;
`;

const StyledDescription = styled.p`
  padding-bottom: 24px;
  margin-bottom: auto;
`;

type Props = BlockImageList;

export default function SolutionsMobile({ cards }: Props) {
  const leftArrowRef = useRef<HTMLButtonElement>(null);
  const rightArrowRef = useRef<HTMLButtonElement>(null);
  const options: SwiperOptions = {
    modules: [Navigation],
    navigation: { prevEl: leftArrowRef.current, nextEl: rightArrowRef.current },
  };

  return (
    <BreakpointBox breakpoints={{ md: 'block' }}>
      <StyledWrapper data-aos='fade-up'>
        <StyledArrowWrapper>
          <StyledInnerArrowWrapper>
            <StyledArrow ref={leftArrowRef} leadingIcon={<StyledChevronLeft />} />
            <StyledArrow ref={rightArrowRef} leadingIcon={<StyledChevronRight />} direction='right' />
          </StyledInnerArrowWrapper>
        </StyledArrowWrapper>
        <StyledSwiper
          {...options}
          onBeforeInit={swiper => {
            // Ref: https://github.com/nolimits4web/swiper/issues/3855
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line no-param-reassign
            swiper.params.navigation.prevEl = leftArrowRef.current;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line no-param-reassign
            swiper.params.navigation.nextEl = rightArrowRef.current;
          }}>
          {cards?.map(({ id, overlineText, title, description, button, mobileImage }) => (
            <SwiperSlide key={id}>
              <StyledSlide>
                <StyledLabel text={overlineText} />
                <StyledImageWrapper>
                  <Image {...getImageProps(mobileImage)} objectFit='contain' />
                </StyledImageWrapper>
                <StyledTitle>{title}</StyledTitle>
                <StyledDescription>{description}</StyledDescription>
                <Link variant='outline' href={button?.link} target={button?.openNewTab ? '_blank' : '_self'}>
                  {button?.text}
                </Link>
              </StyledSlide>
            </SwiperSlide>
          ))}
        </StyledSwiper>
      </StyledWrapper>
    </BreakpointBox>
  );
}
