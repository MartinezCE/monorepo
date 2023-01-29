import React from 'react';
import { FormikProvider, useFormik } from 'formik';
import styled from 'styled-components';
import { SwiperOptions } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Space } from '@wimet/apps-shared';
import Card from '../../Card';
import CommonFilterSpaceHeader from '../../CommonFilterSpaceHeader';
import { Layout } from '../../mixins';
import useGetSpaces from '../../../hooks/api/useGetSpaces';
import SpaceDetailsSection from '../SpaceDetailsSection';

const StyledWrapper = styled.div`
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  row-gap: 40px;
  margin-bottom: 168px;
`;

const StyledLayoutWrapper = styled.div`
  ${Layout}
  width: 100%;
  max-width: 100%;
  padding: 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0;
  }
`;

const StyledRow = styled.div`
  width: 737px;
  display: flex;
  column-gap: 40px;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const StyledSwiper = styled(Swiper)`
  ${Layout}
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  row-gap: 20px;
  padding: 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0;
  }
  .swiper-wrapper {
    width: unset;
  }

  .swiper-slide {
    width: auto;
    height: auto;
  }
`;

const StyledCard = styled(Card)`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    > div {
      width: 264px;
      > div:last-child > div:last-child {
        display: none;
      }
    }
  }
`;

type Props = {
  locationId: number;
  title: string;
};

export default function SpaceDetailsRecommendationsSection({ locationId, title }: Props) {
  const options: SwiperOptions = { slidesPerView: 'auto', spaceBetween: 16 };
  const formik = useFormik({
    initialValues: { spaceReservationTypeId: 1, spaceTypeId: undefined },
    onSubmit: () => {},
  });
  const { data: spaces = [] as Space[] } = useGetSpaces(locationId, formik.values);

  return (
    <FormikProvider value={formik}>
      <SpaceDetailsSection title={title} keepChildrenInLayout={false}>
        <StyledWrapper>
          <StyledLayoutWrapper>
            <StyledRow>
              <CommonFilterSpaceHeader />
            </StyledRow>
          </StyledLayoutWrapper>
          {spaces && (
            <StyledSwiper {...options}>
              {spaces.map(space => (
                <SwiperSlide key={space?.id}>
                  <StyledCard
                    space={space}
                    location={space.location}
                    company={space.location.company}
                    href={`/spaces/${space.id}`}
                  />
                </SwiperSlide>
              ))}
            </StyledSwiper>
          )}
        </StyledWrapper>
      </SpaceDetailsSection>
    </FormikProvider>
  );
}
