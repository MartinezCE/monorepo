/* eslint-disable no-return-assign */
import { GetServerSidePropsContext } from 'next';
import { useRef, useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import styled from 'styled-components';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { AxiosRequestHeaders } from 'axios';
import {
  BreakpointBox,
  Button,
  getAllSpacesTypes,
  getReservationType,
  GET_ALL_SPACES_TYPES,
  GET_RESERVATION_TYPE,
  Space,
} from '@wimet/apps-shared';
import { Layout as LayoutMixin } from '../../components/mixins';
import Layout from '../../components/UI/Layout';
import { DynamicPageProps } from '../../interfaces/api';
import SpaceDetailsHeader from '../../components/DiscoverSpaceDetailsPage/SpaceDetailsHeader';
import SpaceDetailsHeaderSwiper from '../../components/DiscoverSpaceDetailsPage/SpaceDetailsHeaderSwiper';
import SpaceDetailsSubHeader from '../../components/DiscoverSpaceDetailsPage/SpaceDetailsSubHeader';
import SpaceDetailsSection from '../../components/DiscoverSpaceDetailsPage/SpaceDetailsSection';
import SpaceDetailsCreditsSection from '../../components/DiscoverSpaceDetailsPage/SpaceDetailsCreditsSection';
import SpaceDetailsAmenitiesSection from '../../components/DiscoverSpaceDetailsPage/SpaceDetailsDisponibilityAmenitiesSection/SpaceDetailsAmenitiesSection';
import SpaceDetailsMapSection from '../../components/DiscoverSpaceDetailsPage/SpaceDetailsMapSection';
import SpaceDetailsDocumentButton from '../../components/DiscoverSpaceDetailsPage/SpaceDetailsDocumentButton';
import SpaceDetailsRecommendationsSection from '../../components/DiscoverSpaceDetailsPage/SpaceDetailsRecommendationsSection';
import SpaceDetailsStickyHeader from '../../components/DiscoverSpaceDetailsPage/SpaceDetailsStickyHeader';
import useStickyHeader from '../../hooks/useStickyHeader';
import useVisibleSection from '../../hooks/useVisibleSection';
import useGetSpace, { getSpace, GET_SPACE_DETAILS } from '../../hooks/api/useGetSpace';
import SpaceDetailsCalendar from '../../components/DiscoverSpaceDetailsPage/SpaceDetailsCalendar';
import SpaceDetailsDisponibilityAmenitiesSection from '../../components/DiscoverSpaceDetailsPage/SpaceDetailsDisponibilityAmenitiesSection';

const StyledLayout = styled(Layout)`
  background-color: ${({ theme }) => theme.colors.extraLightGray};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    > div:last-child {
      display: none;
    }
  }
`;

const StyledContentWrapper = styled.div`
  ${LayoutMixin}
  margin-bottom: 168px;
  row-gap: 104px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledContentDetailWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  column-gap: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
  }
`;

const StyledContentLeft = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 104px;
  flex: 1;
`;

const StyledText = styled.span`
  margin-top: 19px;
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  line-height: ${({ theme }) => theme.lineHeights[2]};
  display: inline-block;

  > b {
    font-weight: ${({ theme }) => theme.fontWeight[2]};
  }
`;

const StyledDocumentGrid = styled.div`
  display: grid;
  margin-top: 25px;
  grid-template-columns: repeat(auto-fill, 179px);
  gap: 32px;
`;

const StyledSwitchButtonContainer = styled.div`
  display: none;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    position: fixed;
    width: 100%;
    height: 90px;
    z-index: 8;
    bottom: 60px;
    background: linear-gradient(180.65deg, rgba(255, 255, 255, 0) 0.56%, #ffffff 99.44%);
    border-radius: 8px 8px 0px 0px;
  }
`;

const StyledSwitchButton = styled(Button)`
  display: none;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    width: 90%;
    background-color: ${({ theme: { colors } }) => `${colors.blue} !important`};
    color: ${({ theme: { colors } }) => `${colors.white} !important`};
    height: 44px;
    margin-left: 5%;
    margin-top: 10%;
  }
`;

const StyledMainSection = styled.div<{ hide: boolean }>`
  display: flex;
  flex-direction: column;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ hide }) => (hide ? 'none' : 'flex')};
  }
`;

type SectionsRef = (HTMLElement | HTMLElement[] | null)[];

type Props = DynamicPageProps & {
  locationId: number;
};

export default function DiscoverSpaceDetailsPage({ locale, locationId }: Props) {
  const { showStickyHeader } = useStickyHeader({ headerWidth: 80 });
  const [openCalendar, setOpenCalendar] = useState(false);
  const { query } = useRouter();
  const sectionsRef = useRef<SectionsRef>([]);
  const { visibleSection, handleClickHeaderItem } = useVisibleSection({
    sections: sectionsRef,
    scrollPositionToCheck: 80,
    gap: 104,
  });
  const { data: space = {} as Partial<Space> } = useGetSpace(query.spaceId as string);

  return (
    <StyledLayout locale={locale} title='Wimet | Discover' isFixed={false}>
      <StyledMainSection hide={openCalendar}>
        <SpaceDetailsStickyHeader
          activeSectionId={visibleSection}
          space={space}
          show={showStickyHeader}
          onClickItem={handleClickHeaderItem}
        />
        <SpaceDetailsHeader space={space} onClickDiscounts={() => handleClickHeaderItem(3)} />
        <SpaceDetailsHeaderSwiper
          imageList={space.spaceFiles?.images || []}
          tourUrl={space.tourUrl}
          ref={ref => (sectionsRef.current[0] = ref)}
        />
        <StyledContentWrapper>
          <StyledContentDetailWrapper>
            <StyledContentLeft>
              <SpaceDetailsSection>
                <SpaceDetailsSubHeader space={space} />
              </SpaceDetailsSection>
              <SpaceDetailsSection
                ref={ref => (sectionsRef.current[1] = ref)}
                title='El lugar'
                description={space?.location?.description}>
                {space?.area && (
                  <StyledText>
                    <b>Superficie:</b> {space?.area} m2
                  </StyledText>
                )}
              </SpaceDetailsSection>
              <SpaceDetailsDisponibilityAmenitiesSection ref={sectionsRef} space={space} />
              {(space.monthly || !!space.hourly?.length) && (
                <SpaceDetailsCreditsSection ref={sectionsRef} space={space} />
              )}
              <SpaceDetailsSection
                ref={ref => (sectionsRef.current[4] = ref)}
                title='Cómo llegar'
                description={space.location?.comments}>
                <SpaceDetailsMapSection space={space} />
              </SpaceDetailsSection>
              {!!space.location?.locationsAmenities?.SAFETY?.length && (
                <SpaceDetailsSection
                  ref={ref => (sectionsRef.current[5] = ref)}
                  title='Protocolo de seguridad e higiene'
                  description={`
            Las pautas de seguridad son proporcionadas por ${space.location?.company.name}
            y se actualizaron por última vez el ${format(new Date(space.updatedAt || new Date()), 'dd/MM/yy')}.
          `}>
                  <SpaceDetailsAmenitiesSection amenities={space.location?.locationsAmenities.SAFETY} />
                </SpaceDetailsSection>
              )}
              {!!space.location?.locationFiles.documents?.length && (
                <SpaceDetailsSection ref={ref => (sectionsRef.current[6] = ref)} title='Documentos'>
                  <StyledDocumentGrid>
                    {space.location.locationFiles.documents?.map(document => (
                      <SpaceDetailsDocumentButton key={document.id} document={document} />
                    ))}
                  </StyledDocumentGrid>
                </SpaceDetailsSection>
              )}
            </StyledContentLeft>
            <SpaceDetailsCalendar space={space} />
          </StyledContentDetailWrapper>
          <SpaceDetailsRecommendationsSection
            title={`Otros Espacios en ${space.location?.name}`}
            locationId={locationId}
          />
        </StyledContentWrapper>
        <StyledSwitchButtonContainer>
          <StyledSwitchButton onClick={() => setOpenCalendar(true)}>Reservar</StyledSwitchButton>
        </StyledSwitchButtonContainer>
      </StyledMainSection>
      <BreakpointBox breakpoints={{ md: 'flex' }}>
        <SpaceDetailsCalendar setIsOpen={setOpenCalendar} isOpen={openCalendar} space={space} />
      </BreakpointBox>
    </StyledLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const { spaceId } = context.query;
  let space: Space | undefined;

  try {
    space = await queryClient.fetchQuery([GET_SPACE_DETAILS, spaceId], () =>
      getSpace(spaceId as string, context.req.headers as AxiosRequestHeaders)
    );

    await Promise.all([
      queryClient.prefetchQuery(GET_RESERVATION_TYPE, () => getReservationType()),
      queryClient.prefetchQuery(GET_ALL_SPACES_TYPES, () => getAllSpacesTypes()),
    ]);
  } catch (error) {
    if (!space) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      locationId: space?.locationId || 0,
    },
  };
}
