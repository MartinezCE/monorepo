import { SwiperOptions } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import styled from 'styled-components';
import { customTheme } from '../../Theme';
import Label from '../../UI/Label';
import { BlockHorizontalSlider } from '../../../interfaces/api';
import { getImageProps } from '../../../utils/images';

const StyledWrapper = styled.div`
  padding: 75px 0;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 56px 0;
  }
`;

const StyledInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px 0;
  background-color: ${({ theme }) => theme.colors.extraLightGray};
  row-gap: 48px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 42px;
    padding-bottom: 54px;
    row-gap: 20px;
  }
`;

const StyledTitle = styled.h5`
  padding: 0 max(calc(((100vw - 1440px) / 2) + 104px), 104px);

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
  }
`;

const StyledSwiper = styled(Swiper)`
  padding: 0 max(calc(((100vw - 1440px) / 2) + 104px), 104px);

  .swiper-slide {
    width: auto;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
  }
`;

const StyledCard = styled.div`
  width: min-content;
  display: flex !important;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: 10px;
  row-gap: 16px;
  border: 2px solid transparent;
  transition: all 0.2s linear;
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.colors.blue};
    box-shadow: ${({ theme }) => theme.shadows[0]};
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    row-gap: 12px;
  }
`;

const StyledImageContainer = styled.div`
  position: relative;
  width: 264px;
  height: 160px;
`;

const StyledLabel = styled(Label)`
  text-transform: none;
  font-size: ${({ theme }) => theme.fontSizes[4]};
  padding: 0 12px;
  padding-bottom: 6px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes[0]};
    padding-bottom: 2px;
  }
`;

type Props = BlockHorizontalSlider;

export default function HorizontalSlider({ slides, title }: Props) {
  const options: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 16,
    breakpoints: {
      [Number(customTheme.breakpoints.md.replace('px', ''))]: {
        spaceBetween: 32,
      },
    },
  };

  return (
    <StyledWrapper data-aos='fade-up'>
      <StyledInnerWrapper>
        <StyledTitle>{title}</StyledTitle>
        <div>
          <StyledSwiper {...options}>
            {slides?.map(({ id, image, title: slideTitle }) => (
              <SwiperSlide key={id}>
                <StyledCard>
                  <StyledImageContainer>
                    <Image {...getImageProps(image, 'fill')} objectFit='contain' objectPosition='center' />
                  </StyledImageContainer>
                  <StyledLabel text={slideTitle} />
                </StyledCard>
              </SwiperSlide>
            ))}
          </StyledSwiper>
        </div>
      </StyledInnerWrapper>
    </StyledWrapper>
  );
}
