import { DomUtil, LatLng, LatLngBounds, LatLngBoundsExpression, LeafletEvent, Point, Popup } from 'leaflet';
import { useRef } from 'react';
import { useMap } from 'react-leaflet';
import usePopupContainerEvents from './usePopupContainerEvents';

type Props = {
  paddingXY?: [number, number];
  offset?: [number, number];
};

const useAutoPan = ({ paddingXY = [5, 5], offset = [0, 0] }: Props = {}) => {
  const maxBoundsRef = useRef<LatLngBoundsExpression | null>(null);
  const map = useMap();

  const handlePopupOpen = (e: LeafletEvent & { popup: Popup }) => {
    const el = e.popup.getElement();
    if (!el) return;

    maxBoundsRef.current = map.options.maxBounds as LatLngBoundsExpression;

    const mapSize = map.getSize();
    const padding = new Point(paddingXY[0], paddingXY[1]);
    const popupSize = { x: el.offsetWidth, y: el.offsetHeight };
    const popupPos = map.layerPointToContainerPoint(DomUtil.getPosition(el));
    const parsedPopupPos = popupPos.add(offset);

    const popupLeftEdgePos = parsedPopupPos.x - padding.x;
    const popupRightEdgePos = parsedPopupPos.x + popupSize.x + padding.x;
    const popupTopEdgePos = parsedPopupPos.y - padding.y;
    const popupBottomEdgePos = parsedPopupPos.y + popupSize.y + padding.y;

    const isPopupLeftEdgeOutsideMap = popupLeftEdgePos < 0;
    const isPopupRightEdgeOutsideMap = popupRightEdgePos > mapSize.x;
    const isPopupTopEdgeOutsideMap = popupTopEdgePos < 0;
    const isPopupBottomEdgeOutsideMap = popupBottomEdgePos > mapSize.y;

    let distanceX = 0;
    let distanceY = 0;

    if (isPopupLeftEdgeOutsideMap) distanceX = popupLeftEdgePos;
    if (isPopupRightEdgeOutsideMap) distanceX = popupRightEdgePos - mapSize.x;
    if (isPopupTopEdgeOutsideMap) distanceY = popupTopEdgePos;
    if (isPopupBottomEdgeOutsideMap) distanceY = popupBottomEdgePos - mapSize.y;

    if (maxBoundsRef.current instanceof LatLngBounds) {
      let SW = maxBoundsRef.current.getSouthWest();
      let NE = maxBoundsRef.current.getNorthEast();
      const parsedDistance = map.unproject([distanceX + 20, distanceY + 20]);

      if (distanceY > 0) SW = new LatLng(SW.lat + parsedDistance.lat, SW.lng);
      if (distanceX < 0) SW = new LatLng(SW.lat, SW.lng - parsedDistance.lng);
      if (distanceY < 0) NE = new LatLng(NE.lat - parsedDistance.lat, NE.lng);
      if (distanceX > 0) NE = new LatLng(NE.lat, NE.lng + parsedDistance.lng);

      map.setMaxBounds(new LatLngBounds(SW, NE));
    }

    map.fire('autopanstart').panBy([distanceX, distanceY], { animate: true });
  };

  const handlePopupClose = () => {
    if (!maxBoundsRef.current) return;
    map.setMaxBounds(maxBoundsRef.current);
  };

  usePopupContainerEvents({ popupopen: handlePopupOpen, popupclose: handlePopupClose });
};

export default useAutoPan;
