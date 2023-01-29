/* eslint-disable consistent-return */
import { useEffect } from 'react';
import styled from 'styled-components';
import { Marker } from 'react-leaflet';
import { useFormikContext } from 'formik';
import { Blueprint as BlueprintType, BookingStatus, SpaceTypeEnum, WPMReservation } from '@wimet/apps-shared';
import { useGetSeats } from '../../../hooks/api/useGetSeats';
import BlueprintAreaHeader from './BlueprintAreaHeader';
import Blueprint from '../../UI/Blueprint';
import useBlueprintToolbar, { MarkerProps } from '../../../hooks/useBlueprintToolbar';
import SeatInfoPopup from '../../AvailabilityPage/SeatInfoPopup';
import BlueprintContainer from '../../WorkplaceManagerPage/SelectSeatsSection/BlueprintContainer';
import useSeatMarkers from '../../../hooks/useSeatMarkers';
import useGetMarkerIcon, { MarkerVariants } from '../../../hooks/useGetMarkerIcon';
import { BookingInitialValues, WPMReservationPayload } from '../../../pages/spaces/office';

const StyledWrapper = styled.div`
  margin-top: 48px;
`;

const StyledBlueprintWrapper = styled.div`
  margin-top: 24px;
`;

type Props = {
  blueprint: BlueprintType;
  floorNumber: string;
  isReservable?: boolean;
  selectedSeatId?: number;
  hideHeader?: boolean;
  filterMarkersBy?: SpaceTypeEnum;
  popupType?: 'default-web' | 'custom-mobile';
  hideZoomControl?: boolean;
  onPopupOpen?: (seatId: number) => void;
  onPopupClose?: () => void;
};

const BlueprintArea = ({
  blueprint,
  floorNumber,
  isReservable,
  hideHeader = false,
  filterMarkersBy,
  popupType,
  hideZoomControl = false,
  selectedSeatId,
  onPopupOpen,
  onPopupClose,
}: Props) => {
  const { values, touched, setFieldValue, setTouched } = useFormikContext<BookingInitialValues>();
  const { selectedDate, reservations } = values;

  const { data } = useGetSeats(blueprint?.id, { includeReservations: true, selectedDate }, { keepPreviousData: true });
  const markers = useSeatMarkers(data);
  const { markerRefs } = useBlueprintToolbar({ markers });
  const getMarkerIcon = useGetMarkerIcon();

  const isAddedToReserveList = (id?: number) => reservations.some(r => r.seatId === id);

  const handleOnReserveClick = (m: MarkerProps, isInReserveList: boolean) => {
    if (isInReserveList) return;

    const newReservation: WPMReservationPayload = {
      seatId: Number(m.id),
      startAt: selectedDate,
      metadata: {
        seatName: String(m.name),
        blueprintName: blueprint.name,
        floorNumber,
        spaceType: m.spaceType,
      },
    };

    setFieldValue('reservations', [...reservations, newReservation]);
    if (touched.reservations) return;
    setTouched({ reservations: [] });
  };

  const getPopupVariant = (_reservations: WPMReservation[] = [], isAvailable = true, spaceType?: SpaceTypeEnum) => {
    const reservationType = _reservations[0]?.WPMReservationType?.name as keyof typeof MarkerVariants;
    const reservationStatus = _reservations[0]?.status as BookingStatus;

    if (spaceType === SpaceTypeEnum.MEETING_ROOM) return MarkerVariants.MEETING_ROOM;

    if (!isAvailable) return MarkerVariants.UNAVAILABLE;

    if (reservationStatus === BookingStatus.CANCEL) return MarkerVariants.AVAILABLE;

    return _reservations.length === 2
      ? MarkerVariants.MORNING_AFTERNOON
      : MarkerVariants[reservationType] ?? MarkerVariants.AVAILABLE;
  };

  useEffect(() => {
    if (!selectedSeatId) return;

    const { ref } = markerRefs.current.find(m => Number(m.id) === selectedSeatId) || {};
    ref?.openPopup();

    return () => {
      ref?.closePopup();
    };
  }, [markerRefs, selectedSeatId]);

  return (
    <StyledWrapper>
      {!hideHeader && <BlueprintAreaHeader />}
      <StyledBlueprintWrapper>
        <BlueprintContainer showOverlay={!blueprint?.url}>
          <Blueprint imageOverlayUrl={blueprint?.url} hideZoomControl={hideZoomControl}>
            {markers
              ?.filter(m => (filterMarkersBy ? m.spaceType === filterMarkersBy : m))
              .map((m, i) => {
                const variant = getPopupVariant(m.reservations, m.isAvailable, m.spaceType);
                const isInReserveList = isAddedToReserveList(Number(m.id));

                return (
                  <Marker
                    key={m.id}
                    ref={ref => {
                      if (!ref) return;
                      markerRefs.current[i] = { ...m, ref };
                    }}
                    position={m.pos}
                    icon={getMarkerIcon({ variant })}>
                    {m.isAvailable && (
                      <SeatInfoPopup
                        popupType={popupType}
                        id={Number(m.id)}
                        variant={variant}
                        seatName={m.name}
                        onReserveClick={() => handleOnReserveClick(m, isInReserveList)}
                        isAddedToReserveList={isInReserveList}
                        selectedDate={selectedDate}
                        isReservable={isReservable}
                        onPopupOpen={onPopupOpen}
                        onPopupClose={onPopupClose}
                      />
                    )}
                  </Marker>
                );
              })}
          </Blueprint>
        </BlueprintContainer>
      </StyledBlueprintWrapper>
    </StyledWrapper>
  );
};

export default BlueprintArea;
