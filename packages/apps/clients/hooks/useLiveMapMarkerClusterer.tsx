import { useMarkerClusterer, WPMReservation, GetInfoWindowOpts } from '@wimet/apps-shared';
import React, { useCallback, useMemo, useRef } from 'react';
import ClusteredAvatar from '../components/LivePage/ClusteredAvatar';
import LiveMapPopup from '../components/LivePage/LiveMapPopup';

type Props = {
  map: google.maps.Map;
  avatarSize: number;
  onPopupOpen?: (reservationIds: number[]) => void;
  onPopupClose?: () => void;
};

const useLiveMapMarkerClusterer = ({ map, avatarSize, onPopupOpen, onPopupClose }: Props) => {
  const pixelOffsetRef = useRef<google.maps.Size>();
  const clustererComponent = useCallback(c => <ClusteredAvatar count={c} size={avatarSize} />, [avatarSize]);
  const algorithmOpts = useMemo(() => ({ maxZoom: 24 }), []);
  const onClusterClick = useCallback(() => {}, []);
  const getInfoWindowOpts = useCallback<GetInfoWindowOpts>(
    (reservations: WPMReservation[]) => {
      pixelOffsetRef.current = pixelOffsetRef.current || new google.maps.Size(160, 200, 'px', '%');

      return {
        pixelOffset: pixelOffsetRef.current,
        onOpen: () => onPopupOpen?.(reservations.map(({ id }) => id)),
        onClose: onPopupClose,
        content: <LiveMapPopup reservations={reservations} />,
      };
    },
    [onPopupClose, onPopupOpen]
  );
  const { infoWindow: clustererInfoWindow, markerClusterer } = useMarkerClusterer({
    map,
    clustererComponent,
    algorithmOpts,
    onClusterClick,
    getInfoWindowOpts,
  });

  return { markerClusterer, clustererInfoWindow, clustererGetInfoWindowOpts: getInfoWindowOpts };
};

export default useLiveMapMarkerClusterer;
