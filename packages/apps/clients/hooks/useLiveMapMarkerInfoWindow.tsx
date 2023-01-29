import { InfoWindow, useInfoWindow, WPMReservation, GetInfoWindowOpts } from '@wimet/apps-shared';
import React, { useCallback, useRef } from 'react';
import LiveMapPopup from '../components/LivePage/LiveMapPopup';

type Props = {
  map: google.maps.Map;
  onPopupOpen?: (reservationIds: number[]) => void;
  onPopupClose?: () => void;
};

const useLiveMapMarkerInfoWindow = ({ map, onPopupOpen, onPopupClose }: Props) => {
  const markerInfoWindow = useInfoWindow({ map });
  const pixelOffsetRef = useRef<google.maps.Size>();
  const markerGetInfoWindowOpts = useCallback<GetInfoWindowOpts>(
    (reservations: WPMReservation[]) => {
      const [r] = reservations;
      pixelOffsetRef.current = pixelOffsetRef.current || new google.maps.Size(160, 150, 'px', '%');

      return {
        id: `${r.id}`,
        pixelOffset: pixelOffsetRef.current,
        onOpen: () => onPopupOpen?.(reservations.map(({ id }) => id)),
        onClose: onPopupClose,
        content: (
          <InfoWindow id={`${r.id}`}>
            <LiveMapPopup reservations={[r]} />
          </InfoWindow>
        ),
      };
    },
    [onPopupClose, onPopupOpen]
  );

  return { markerInfoWindow, markerGetInfoWindowOpts };
};

export default useLiveMapMarkerInfoWindow;
