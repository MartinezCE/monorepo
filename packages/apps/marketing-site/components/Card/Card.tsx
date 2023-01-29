/* eslint-disable no-param-reassign */
import Link from 'next/link';
import React, { ForwardedRef, forwardRef, useRef } from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';
import { Pagination, Navigation, SwiperOptions } from 'swiper';
import { NavigationOptions } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  ArrowButton,
  pluralize,
  images,
  SpaceReservationType,
  Tag,
  useGetAllSpacesTypes,
  Company,
  Location,
  Space,
} from '@wimet/apps-shared';
import { ChevronLeft, ChevronRight } from '../../assets/images';
import { getSpaceReferencePrice, showPeopleCapacity } from '../../utils/space';

type StyledArrowProps = {
  direction?: 'left' | 'right';
};

const StyledLink = styled.a`
  color: unset;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
`;

type StyledWrapperProps = {
  isSelected?: boolean;
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  /* min-height: 378px; */ //TODO: Remove this when we have credits API
  height: 100%;
  width: 389px;
  background-color: white;
  border-radius: 8px;
  border: 2px solid transparent;
  padding: 10px;
  transition: border-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
  cursor: pointer;

  ${({ isSelected }) =>
    isSelected &&
    css`
      border: 2px solid ${({ theme }) => theme.colors.blue};
      box-shadow: 0px 20px 50px #2c30381e;
    `}

  &:hover {
    border: 2px solid ${({ theme }) => theme.colors.blue};
  }
`;

const StyledArrow = styled(ArrowButton)<StyledArrowProps>`
  position: absolute;
  top: calc(50% - 16px);
  ${({ direction }) => (!direction || direction === 'left' ? 'left: 0' : 'right: 0')};
  color: white;
  z-index: 2;
  background: rgba(44, 48, 56, 0.4);
  height: 32px;
  width: 32px;
  padding: 0;
  transition: opacity 0.1s ease-in-out;
  opacity: 0;

  &:hover,
  :active,
  :focus {
    background: rgba(44, 48, 56, 0.4);
    color: white;
  }

  &:disabled {
    opacity: 0 !important;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    opacity: 1;
  }
`;

const StyledSwiperWrapper = styled.div`
  position: relative;
  height: 186px;
  width: 100%;

  &:hover > ${StyledArrow} {
    opacity: 1;
  }
`;

const StyledSwiperComponent = styled(Swiper)`
  height: 100%;
  border-radius: 8px;

  .swiper-slide {
    height: auto;
  }

  .swiper-pagination {
    bottom: 12px;
  }

  .swiper-pagination-bullet {
    background-color: ${({ theme }) => theme.colors.gray};
    opacity: 1;
    height: 6px;
    width: 6px;
    &-active {
      background-color: white;
    }
  }
`;

const StyledQuotaLabel = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 75px;
  height: 28px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.colors.lightOrange};
`;

const StyledDetailWrapper = styled.div`
  margin: 0 14px 14px;
`;

const StyledSpaceNameText = styled.div`
  margin-top: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkBlue};
  font-size: 20px;
  line-height: 28px;
`;

const StyledCompanyText = styled.div`
  margin-top: 2px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.darkBlue};
  font-size: 16px;
  line-height: 24px;
`;

const StyledDetailDescription = styled.div`
  display: flex;
  margin-top: 16px;
`;

const StyledDescriptionItem = styled.div`
  display: flex;
  align-items: center;

  &:last-child {
    margin-left: 24px;
    flex-shrink: 0;
  }
`;

const StyledLocationIcon = styled(images.Pin)`
  color: ${({ theme }) => theme.colors.orange};
  flex-shrink: 0;
`;

const StyledIconClock = styled(images.Clock)`
  color: ${({ theme }) => theme.colors.orange};
`;

const StyledRow = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledCreditsInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  padding: 8px 16px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.blue};
  border: 1px solid ${({ theme }) => theme.colors.blue};
`;

const StyledText = styled.span`
  font-size: 14px;
  line-height: 20px;
  font-weight: 200;
  margin-left: 6px;
`;

type Props = {
  isSelected?: boolean;
  space: Space;
  location: Location;
  company?: Company;
  href: string;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const Card = (
  { space, location, href = '', isSelected, className, onMouseEnter, onMouseLeave }: Props,
  ref: ForwardedRef<HTMLAnchorElement>
) => {
  const { data } = useGetAllSpacesTypes({ staleTime: Infinity });
  const leftArrowRef = useRef<HTMLButtonElement>(null);
  const rightArrowRef = useRef<HTMLButtonElement>(null);

  const options: SwiperOptions = {
    modules: [Pagination, Navigation],
    pagination: { clickable: true },
    navigation: { prevEl: leftArrowRef.current, nextEl: rightArrowRef.current },
    slidesPerView: 1,
  };

  const isHourly = space.spaceReservationType?.value === SpaceReservationType.HOURLY;
  const hasDiscount = !!space.monthly?.spaceDiscounts.length;

  const referencePrice = getSpaceReferencePrice(space, data);

  return (
    <Link href={href} passHref>
      <StyledLink ref={ref} className={className}>
        <StyledWrapper isSelected={isSelected} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <StyledSwiperWrapper>
            {showPeopleCapacity(space, data) && (
              <StyledQuotaLabel>{pluralize(space.peopleCapacity, 'persona', true)}</StyledQuotaLabel>
            )}
            <StyledArrow ref={leftArrowRef} leadingIcon={<ChevronLeft />} />
            <StyledArrow ref={rightArrowRef} leadingIcon={<ChevronRight />} direction='right' />
            <StyledSwiperComponent
              {...options}
              onBeforeInit={swiper => {
                (swiper?.params?.navigation as NavigationOptions).prevEl = leftArrowRef.current;
                (swiper?.params?.navigation as NavigationOptions).nextEl = rightArrowRef.current;
              }}>
              {space.spaceFiles?.images &&
                space.spaceFiles.images.map(image => (
                  <SwiperSlide key={image.id}>
                    <Image layout='fill' objectFit='cover' src={image.url} />
                  </SwiperSlide>
                ))}
            </StyledSwiperComponent>
          </StyledSwiperWrapper>
          <StyledDetailWrapper>
            <StyledSpaceNameText>{space.name}</StyledSpaceNameText>
            <StyledCompanyText>{location?.name}</StyledCompanyText>
            <StyledDetailDescription>
              <StyledDescriptionItem>
                <StyledLocationIcon />
                <StyledText>{`${location.streetName} ${location.streetNumber}`.trim() || location.address}</StyledText>
              </StyledDescriptionItem>
              <StyledDescriptionItem>
                {space.schedule && !!space.schedule.length && (
                  <>
                    <StyledIconClock />
                    <StyledText>
                      {space.schedule[0].is24Open
                        ? 'Disponible 24 hs.'
                        : `De ${space.schedule[0]?.openTime?.split(':')[0]} a ${
                            space.schedule[0]?.closeTime?.split(':')[0]
                          } hs`}
                    </StyledText>
                  </>
                )}
              </StyledDescriptionItem>
            </StyledDetailDescription>
            {referencePrice.show && (
              <StyledRow>
                <StyledCreditsInfo>
                  {referencePrice.cost} {referencePrice.priceText}
                </StyledCreditsInfo>
                {!isHourly && hasDiscount && <Tag>+ descuento</Tag>}
              </StyledRow>
            )}
          </StyledDetailWrapper>
        </StyledWrapper>
      </StyledLink>
    </Link>
  );
};

export default forwardRef(Card);
