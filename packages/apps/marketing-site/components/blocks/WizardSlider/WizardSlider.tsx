import { ArrowButton, Tab, TabItem } from '@wimet/apps-shared';
import Image from 'next/image';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { Navigation, SwiperOptions, Swiper } from 'swiper';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';
import { ChevronLeft, ChevronRight } from '../../../assets/images';
import { BlockWizardSlider } from '../../../interfaces/api';
import { getImageProps } from '../../../utils/images';
import { Layout } from '../../mixins';
import Label from '../../UI/Label';
import RadioButton from '../../UI/RadioButton';
import Text from '../../UI/Text';

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 75px;
  padding-bottom: 75px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 56px 0;
  }
`;

const StyledInnerWrapper = styled.div`
  ${Layout}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const StyledMainTitle = styled.h4`
  margin-bottom: 44px;
`;

const StyledTab = styled(Tab)`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const StyledStepWrapper = styled.div`
  display: flex;
  margin-top: 58px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: center;
  }
`;

const StyledStepRow = styled.div`
  display: flex;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;

    :last-child {
      width: min-content;
    }
  }
`;

const StyledRadioButton = styled(RadioButton)`
  width: 60px;

  > input {
    @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
      padding: 5px;

      &::after {
        width: 3px;
        height: 3px;
      }
    }
  }
`;

const StyledDashedLine = styled.div`
  margin-top: 10px;
  margin-left: -10px;
  margin-right: -10px;
  width: 115px;
  height: 2px;
  background-image: linear-gradient(to right, ${({ theme }) => theme.colors.gray} 33%, transparent 0%);
  background-position: bottom;
  background-size: 8px 2px;
  background-repeat: repeat-x;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    height: 1px;
    margin-top: 5px;
    margin-left: -18px;
    margin-right: -18px;
    background-size: 6px 1px;
  }
`;

const StyledSwiperWrapper = styled.div`
  ${Layout};
  width: 100%;
  margin: 0;
  padding-top: 75px;
`;

const StyledSwiperInnerWrapper = styled.div`
  position: relative;
  padding: 0 60px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0;
    padding-bottom: 52px;
  }
`;

type StyledArrowProps = {
  direction?: 'left' | 'right';
};

const StyledArrow = styled(ArrowButton)<StyledArrowProps>`
  position: absolute;
  top: 50%;
  ${({ direction }) => (!direction || direction === 'left' ? 'left: 0' : 'right: 0')};
  z-index: 2;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    top: 100%;
    width: 28px;
    height: 28px;
    padding: 0;
    transform: translateY(-100%);
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

const StyledSwiperComponent = styled(SwiperComponent)`
  .swiper-slide {
    height: auto;
  }
`;

const StyledStepCard = styled.div`
  display: grid;
  height: 386px;
  grid-template-columns: repeat(2, 1fr);
  padding: 0 20px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 100%;
    padding: 0;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, 1fr);
    text-align: center;
    row-gap: 20px;
  }
`;

const StyledLeftSide = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 90px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 48px;
    align-items: center;
  }
`;

const StyledCounterWrapper = styled.div`
  width: min-content;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const StyledCounter = styled(Label)`
  color: ${({ theme }) => theme.colors.gray};
`;

const StyledUnderline = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.blue};
`;

const StyledTitle = styled.h6`
  margin-top: 20px;
  margin-bottom: 24px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 0;
    margin-bottom: 16px;
    max-width: 250px;
  }
`;

const StyledDescription = styled(Text)`
  max-width: 410px;
`;

const StyledImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  align-self: center;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    align-self: flex-end;
  }
`;

type Props = BlockWizardSlider;

export default function WizardSlider({ title, views, hideSteps }: Props) {
  const tabs = (views || [])?.map(tab => ({
    id: tab.id,
    label: tab?.title || '',
    steps: tab?.slides || [],
  }));
  type Tab = typeof tabs[0];

  const leftArrowRef = useRef<HTMLButtonElement>(null);
  const rightArrowRef = useRef<HTMLButtonElement>(null);

  const [swiperInstance, setSwiperInstance] = useState<Swiper | null>(null);
  const [selectedTab, setSelectedTab] = useState((tabs || [])[0]);
  const [selectedSteps, setSelectedSteps] = useState([selectedTab?.steps[0]]);

  const options: SwiperOptions = {
    modules: [Navigation],
    slidesPerView: 'auto',
    navigation: { prevEl: leftArrowRef.current, nextEl: rightArrowRef.current },
  };

  const handleTabChange = (newActiveTab: Tab) => {
    if (newActiveTab.id === selectedTab.id) return;

    setSelectedTab(newActiveTab);
    setSelectedSteps([newActiveTab.steps[0]]);
    swiperInstance?.slideTo(0, undefined, false);
  };

  const handleStepChange = (newSelectedStepIndex: number) => {
    setSelectedSteps(selectedTab.steps.slice(0, Math.max(newSelectedStepIndex, 0) + 1));
    swiperInstance?.slideTo(newSelectedStepIndex);
  };

  return (
    <StyledWrapper id='como-funciona' data-aos='fade-up'>
      <StyledInnerWrapper>
        {title && <StyledMainTitle>{title}</StyledMainTitle>}
        {tabs.length > 1 && (
          <StyledTab
            tabs={(tabs || []) as TabItem[]}
            active={selectedTab as TabItem}
            onChange={tab => handleTabChange(tab as Tab)}
          />
        )}
        {!hideSteps && (
          <StyledStepWrapper>
            {selectedTab?.steps?.map((step, i) => (
              <StyledStepRow key={step.id}>
                <StyledRadioButton
                  label={step?.overlineText}
                  checked={selectedSteps.includes(step)}
                  onClick={() => handleStepChange(i)}
                />
                {i + 1 < selectedTab?.steps?.length && <StyledDashedLine />}
              </StyledStepRow>
            ))}
          </StyledStepWrapper>
        )}
      </StyledInnerWrapper>
      <StyledSwiperWrapper>
        <StyledSwiperInnerWrapper>
          <StyledArrow ref={leftArrowRef} leadingIcon={<StyledChevronLeft />} />
          <StyledArrow ref={rightArrowRef} leadingIcon={<StyledChevronRight />} direction='right' />
          <StyledSwiperComponent
            {...options}
            onSwiper={setSwiperInstance}
            onSlideNextTransitionStart={e => handleStepChange(e.activeIndex)}
            onSlidePrevTransitionStart={e => handleStepChange(e.activeIndex)}
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
            {selectedTab?.steps?.map((step, i) => (
              <SwiperSlide key={step.id}>
                <StyledStepCard>
                  <StyledLeftSide>
                    <StyledCounterWrapper>
                      <StyledCounter text={`${i < 10 ? '0' : ''}${i + 1}`} />
                      <StyledUnderline />
                    </StyledCounterWrapper>
                    <StyledTitle>{step?.title}</StyledTitle>
                    <StyledDescription>{step?.description}</StyledDescription>
                  </StyledLeftSide>
                  <StyledImageContainer>
                    <Image {...getImageProps(step.image, 'fill')} objectFit='contain' objectPosition='center' />
                  </StyledImageContainer>
                </StyledStepCard>
              </SwiperSlide>
            ))}
          </StyledSwiperComponent>
        </StyledSwiperInnerWrapper>
      </StyledSwiperWrapper>
    </StyledWrapper>
  );
}
