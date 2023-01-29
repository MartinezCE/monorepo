/* eslint-disable react/button-has-type */
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { dehydrate, QueryClient, useQueryClient } from 'react-query';
import { orderBy } from 'lodash';
import styled, { css } from 'styled-components';
import {
  getRadiusFromBounds,
  Map,
  Marker,
  useDebounce,
  useMap,
  PlacesDropdown,
  images,
  Label,
  Space,
  Switch,
  Button,
  InfoWindow,
  useInfoWindow,
} from '@wimet/apps-shared';
import {
  getAllSpacesTypes,
  GET_ALL_SPACES_TYPES,
  GET_RESERVATION_TYPE,
  getReservationType,
  useGetAllSpacesTypes,
} from '@wimet/apps-shared/lib/hooks/api';
import { FormikProvider, useFormik } from 'formik';
import { SwiperOptions } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Layout from '../../components/UI/Layout';
import { getFooter, GET_FOOTER } from '../../hooks/api/useGetFooter';
import { getHeader, GET_HEADER } from '../../hooks/api/useGetHeader';
import { DynamicPageProps } from '../../interfaces/api';
import Card from '../../components/Card';
import FilterSidebar from '../../components/FilterSidebar';
import useSearchSpaces, { SearchSpacesPayload, SEARCH_SPACES } from '../../hooks/api/useSearchSpaces';
import CommonFilterSpaceHeader from '../../components/CommonFilterSpaceHeader';
import { List, World } from '../../assets/images';
import MapMarker from '../../components/MapMarker';

const StyledLayout = styled(Layout)<{ showMap?: boolean }>`
  background-color: ${({ theme }) => theme.colors.extraLightGray};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    > div:last-child {
      display: none;
    }
    ${({ showMap }) =>
      !showMap &&
      css`
        padding-bottom: 100px;
      `}
  }
`;

const StyledInnerWrapper = styled.div`
  display: flex;
  width: 100%;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
    margin-top: 20px;
  }
`;

const StyledCard = styled(Card)`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 24px;
    > div {
      width: 100%;
    }
  }
`;

const StyledSwiper = styled(Swiper)`
  max-width: 350px;
`;

type StyledWrapperProps = {
  isMapCollapsed?: boolean;
  isMapLoaded?: boolean;
  showMap?: boolean;
};

const StyledGridWrapper = styled.div<StyledWrapperProps>`
  width: 100%;
  height: 100%;
  padding-bottom: 46px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 389px);
  gap: 32px;
  overflow-y: auto;
  flex-shrink: 0;
  min-width: 843px;
  margin-left: 104px;
  max-width: calc(100% - 104px);
  padding-right: 33px;
  @media (min-width: 2610px) {
    grid-template-columns: repeat(auto-fill, 454px);
    ${StyledCard} {
      > div {
        width: 100%;
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0px;
    max-width: none;
    min-width: 0px;
    width: 100%;
    display: ${({ showMap }) => (showMap ? 'none' : 'grid')};
    padding: 0px;
    justify-content: center;
  }

  ${({ isMapCollapsed }) =>
    !isMapCollapsed &&
    css`
      width: 59%;
    `}
`;

const StyledMapWrapper = styled.div<StyledWrapperProps>`
  margin-left: auto;
  margin-right: 0;
  flex-grow: 1;

  ${({ isMapCollapsed }) =>
    isMapCollapsed &&
    css`
      flex-grow: 0;
      width: 0;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    display: ${({ isMapLoaded, showMap }) => (isMapLoaded && !showMap ? 'none' : 'flex')};
  }

  > div {
    border-radius: 8px 0 0 8px;
    overflow: hidden;
    top: ${({ theme }) => theme.heights.header};
    height: calc(100vh - ${({ theme }) => theme.heights.header});
    position: sticky;
  }
`;

const StyledInputWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(auto, 359px); // TODO: Add 'auto' column when we have filters
  column-gap: 26px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const StyledSearchIcon = styled(images.Search)`
  padding: 14px 0 14px 24px;
  box-sizing: content-box;
  flex-shrink: 0;
`;

const StyledSwitchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 6px;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const StyledLabel = styled(Label)`
  font-weight: ${({ theme }) => theme.fontWeight[0]};
`;

const StyledSwitchButton = styled(Button)`
  display: none;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    position: fixed;
    z-index: 9999;
    bottom: 60px;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: ${({ theme: { colors } }) => colors.darkGray};
    border-radius: 20px;
    font-size: 18px;
    font-weight: 400;
    &:focus {
      color: ${({ theme: { colors } }) => colors.white};
      background-color: ${({ theme: { colors } }) => colors.darkGray};
    }
  }
`;

const StyledFilterWrapper = styled.div`
  width: 100%;
  justify-content: flex-start;
  margin-top: 31px;
  margin-bottom: 55px;
  height: 50px;
  display: flex;
  column-gap: 40px;
  padding: 0 104px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
    flex-wrap: wrap;
    margin-top: 20px;
    padding-bottom: 10px;
    & .react-select__single-value {
      font-weight: bold !important;
    }
    > div:first-child {
      margin-bottom: 22px;
    }
  }
`;

const FALLBACK_ADDRESS = 'Mexico';

export default function DiscoverPage({ locale }: DynamicPageProps) {
  const router = useRouter();
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const cardRefs = useRef<{ [k: number]: HTMLAnchorElement | null }>({});

  const [payload, setPayload] = useState({} as SearchSpacesPayload);
  const { data: spaceTypes } = useGetAllSpacesTypes({ staleTime: Infinity });
  const [debounceDelay, setDebounceDelay] = useState(500);
  const debouncedPayload = useDebounce(payload, debounceDelay);
  const { data: locations = [] } = useSearchSpaces(debouncedPayload, { keepPreviousData: true, staleTime: 0 });
  const queryClient = useQueryClient();
  const cardsSectionRef = useRef<HTMLDivElement>(null);
  const filtersSectionRef = useRef<HTMLDivElement>(null);
  const formik = useFormik({
    initialValues: {
      spaceTypeId: [],
      spaceReservationTypeId: 1,
      sortBy: 1,
      searchValue: '',
    },
    onSubmit: () => {},
  });

  const { map, setRef } = useMap({
    defaultAddress: router.query.country?.toString() || router.query.city?.toString() || FALLBACK_ADDRESS,
    center: { lat: -9, lng: -20 },
    onDragStart: () => setDebounceDelay(500),
    onBoundsChanged: async _map => {
      const bounds = _map?.getBounds();
      const center = _map?.getCenter();
      if (!bounds || !center) return;

      try {
        await queryClient.cancelQueries(SEARCH_SPACES);

        const radius = getRadiusFromBounds(bounds);
        setPayload(prev => ({
          center: { lat: center.lat(), lng: center.lng() },
          radius,
          spaceTypeId: prev.spaceTypeId || [],
          spaceReservationTypeId: payload.spaceReservationTypeId || formik.values.spaceReservationTypeId,
        }));
      } catch (_) {} // eslint-disable-line no-empty
    },
  });
  const infoWindow = useInfoWindow({ map });

  const handleClick = (id: number, index: number) => {
    setSelectedLocationId(id);
    cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleMarkerVariant = (id: number) => {
    if (selectedLocationId === id) return 'selected';
    if (hoveredCardId === id) return 'hovered';
    return 'unselected';
  };

  const { cards, markers } = useMemo(
    () =>
      locations.reduce(
        (acc, el) => {
          if (!map || !el.spaces?.length) return acc;

          cardRefs.current = {};
          const options: SwiperOptions = { slidesPerView: 'auto', spaceBetween: 16 };

          acc.markers.push(
            <Marker
              key={`marker-${el.id}`}
              position={{ lat: Number(el.latitude), lng: Number(el.longitude) }}
              map={map}
              defaultMarkerVariant={handleMarkerVariant(el.id)}
              onClick={() => handleClick(el.id, el.spaces?.[0].id || 0)}
              infoWindow={{
                instance: infoWindow,
                opts: {
                  id: el.id.toString(),
                  pixelOffset: new google.maps.Size(0, -32),
                  content: (
                    <InfoWindow id={el.id.toString()}>
                      <StyledSwiper {...options}>
                        {el.spaces &&
                          el.spaces.map(space => (
                            <SwiperSlide key={`slide-${space.id}`} onClick={() => router.push(`/spaces/${space.id}`)}>
                              <MapMarker location={el} space={space} spaceTypes={spaceTypes} />
                            </SwiperSlide>
                          ))}
                      </StyledSwiper>
                    </InfoWindow>
                  ),
                },
              }}
            />
          );

          acc.cards = acc.cards.concat(
            (el?.spaces || []).map(space => ({
              ...space,
              order: space.order || 0,
              location: el,
            }))
          );

          return acc;
        },
        { cards: [] as Space[], markers: [] as JSX.Element[] }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locations, hoveredCardId, selectedLocationId, map]
  );

  const spaces = orderBy(cards, ['order'], ['desc']);

  useEffect(() => {
    setPayload({ ...payload, ...formik.values });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values]);

  useEffect(() => {
    if (payload.spaceReservationTypeId !== formik.values.spaceReservationTypeId) {
      setPayload({
        ...payload,
        spaceReservationTypeId: formik.values.spaceReservationTypeId,
      });
    }
    if (payload.center) {
      setIsMapLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload]);

  useEffect(() => {
    if (!router.query.city && !router.query.country) {
      navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        if (map) {
          setTimeout(() => {
            map.setCenter({ lat: latitude, lng: longitude });
            map.setZoom(5);
          }, 1000);
        }
      });
    }
  }, [map, router.query.city, router.query.country]);

  return (
    <StyledLayout locale={locale} title='Wimet | Discover' showMap={showMap}>
      <FormikProvider value={formik}>
        <StyledFilterWrapper ref={filtersSectionRef}>
          <CommonFilterSpaceHeader map={map}>
            <StyledInputWrapper>
              <PlacesDropdown
                placeholder='Buscar por nombre de espacio'
                name='searchValue'
                leadingAdornment={<StyledSearchIcon />}
                map={map}
              />
              {/* <FiltersButton onClick={onClickFilters} /> */}
            </StyledInputWrapper>
            {/* // TODO: Use this when we have filters */}
            {/* <StyledSortSelect
            variant='tertiary'
            options={sortOptions}
            placeholder='Ordenar por'
            instanceId='sortOptions'
            name='sortBy'
            controlShouldRenderValue={false}
            alignMenu='center'
          /> */}
            <StyledSwitchWrapper>
              <StyledLabel text='Ver mapa' variant='currentColor' lowercase />
              <Switch onChange={() => setIsMapCollapsed(!isMapCollapsed)} checked={!isMapCollapsed} />
            </StyledSwitchWrapper>
          </CommonFilterSpaceHeader>
        </StyledFilterWrapper>
        {showFilterSidebar && <FilterSidebar onClose={() => setShowFilterSidebar(false)} />}
        <StyledInnerWrapper ref={cardsSectionRef}>
          <StyledGridWrapper isMapCollapsed={isMapCollapsed} showMap={showMap}>
            {spaces.map(space => (
              <StyledCard
                ref={ref => (cardRefs.current[space.id] = ref)} // eslint-disable-line no-return-assign
                key={`card-${space.id}`}
                space={space}
                location={space.location}
                company={space.location.company}
                href={`/spaces/${space.id}`}
                isSelected={selectedLocationId === space.location.id}
                onMouseEnter={() => setHoveredCardId(space.location.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              />
            ))}
          </StyledGridWrapper>
          <StyledMapWrapper isMapCollapsed={isMapCollapsed} isMapLoaded={isMapLoaded} showMap={showMap}>
            <Map apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} ref={el => el && setRef(el)} map={map}>
              {markers}
            </Map>
          </StyledMapWrapper>
        </StyledInnerWrapper>
      </FormikProvider>
      <StyledSwitchButton onClick={() => setShowMap(!showMap)}>
        {!showMap ? (
          <>
            <World />
            Mapa
          </>
        ) : (
          <>
            <List />
            Lista
          </>
        )}
      </StyledSwitchButton>
    </StyledLayout>
  );
}

export async function getServerSideProps({ locale }: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery([GET_HEADER, locale || ''], () => getHeader({ locale })),
    queryClient.prefetchQuery([GET_FOOTER, locale || ''], () => getFooter({ locale })),
    queryClient.prefetchQuery(GET_ALL_SPACES_TYPES, () => getAllSpacesTypes()),
    queryClient.prefetchQuery(GET_RESERVATION_TYPE, () => getReservationType()),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      locale,
    },
  };
}
