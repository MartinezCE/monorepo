import { Avatar, Map, Marker, useMap } from '@wimet/apps-shared';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import type { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useGetReservations } from '../../../../hooks/api/useGetReservations';
import { BookingInitialValues } from '../../../../pages/spaces/office';
import useLiveMapMarkerClusterer from '../../../../hooks/useLiveMapMarkerClusterer';
import useLiveMapMarkerInfoWindow from '../../../../hooks/useLiveMapMarkerInfoWindow';
import useLiveMapSelectedReservation from '../../../../hooks/useLiveMapSelectedReservation';

const centerLocation = { lat: -34.557834408091814, lng: -58.44669524535084 };
const avatarSize = 48;
const maxZoom = 18;

const StyledMap = styled(Map)`
  border-radius: 8px;
  overflow: hidden;
`;

const StyledAvatar = styled(Avatar)`
  > div {
    box-shadow: 0px 20px 40px -12px ${({ theme }) => theme.colors.darkGrayWithOpacity};
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

type Props = {
  selectedReservationId: number;
  onPopupOpen: (reservationIds: number[]) => void;
  onPopupClose: () => void;
};

const LiveMap = ({ selectedReservationId, onPopupOpen, onPopupClose }: Props) => {
  const { values } = useFormikContext<BookingInitialValues>();
  const { selectedDate } = values;

  const { data = [] } = useGetReservations({ selectedDate });
  const { map, setRef } = useMap({ center: centerLocation, zoom: 15, onClick: () => {}, maxZoom });
  const { markerInfoWindow, markerGetInfoWindowOpts } = useLiveMapMarkerInfoWindow({ map, onPopupOpen, onPopupClose });
  const { clustererInfoWindow, clustererGetInfoWindowOpts, markerClusterer } = useLiveMapMarkerClusterer({
    map,
    onPopupOpen,
    onPopupClose,
    avatarSize,
  });

  useLiveMapSelectedReservation({
    map,
    markerInfoWindow,
    markerGetInfoWindowOpts,
    markerClusterer: markerClusterer as unknown as MarkerClusterer,
    clustererInfoWindow,
    clustererGetInfoWindowOpts,
    selectedReservationId,
  });

  return (
    <StyledMap apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} ref={el => el && setRef(el)} map={map}>
      {data.map(r => {
        const { latitude, longitude } = r.seat?.blueprint?.floor.location || {};
        const position = { lat: Number(latitude), lng: Number(longitude) };

        return (
          <Marker
            key={r.id}
            position={position}
            map={map}
            clusterer={markerClusterer}
            _metadata={r}
            infoWindow={{ instance: markerInfoWindow, opts: markerGetInfoWindowOpts([r]) }}>
            <StyledAvatar size={avatarSize} variant='gray' optimizedImg={false} image={r.user?.avatarUrl} />
          </Marker>
        );
      })}
    </StyledMap>
  );
};

export default LiveMap;
