import { LoadingSpinner } from '@wimet/apps-shared';
import { LatLngBounds, Bounds } from 'leaflet';
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ImageOverlay, ImageOverlayProps, useMap } from 'react-leaflet';
import styled from 'styled-components';
import { getElementFromEvent } from '../../../../utils/leaflet';

const StyledImageOverlay = styled(ImageOverlay)`
  transition: opacity 0.3s ease-in-out;
  opacity: 0;
  border-radius: 8px;

  &.show {
    opacity: 1;
  }

  &.leaflet-interactive {
    cursor: unset;
  }

  &.crosshair {
    cursor: crosshair;
  }

  &.move {
    cursor: move;
  }
`;

const StyledLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

type Props = Omit<ImageOverlayProps, 'bounds'> & {
  onLoad?: (e: L.LeafletEvent) => void;
  onUnload?: () => void;
};

const AnimatedImageOverlay = (
  { children, onLoad, onUnload, ...props }: Props,
  ref: ForwardedRef<L.ImageOverlay | null>
) => {
  const map = useMap();
  const innerRef = useRef<L.ImageOverlay | null>(null);
  const refElement = innerRef.current?.getElement();
  const [bounds, setBounds] = useState(new LatLngBounds([0, 0], [0, 0]));

  useImperativeHandle<L.ImageOverlay | null, L.ImageOverlay | null>(ref, () => innerRef.current);

  const imageOverlayEventsHandler: L.LeafletEventHandlerFnMap = {
    load: e => {
      const { ref: imageOverlayRef } = getElementFromEvent<L.ImageOverlay, HTMLImageElement>(e);
      if (!imageOverlayRef) return;

      const [width, height] = [imageOverlayRef.naturalWidth / 2, imageOverlayRef.naturalHeight / 2];
      const centeredImageBounds = new LatLngBounds([-height, -width], [height, width]);

      let southWest = centeredImageBounds.getSouthWest();
      let northEast = centeredImageBounds.getNorthEast();

      const imageIsInsideMapBounds = map.getPixelBounds().contains(new Bounds([-height, -width], [height, width]));

      if (!imageIsInsideMapBounds) {
        southWest = map.unproject([-width, height], map.getMaxZoom());
        northEast = map.unproject([width, -height], map.getMaxZoom());
      }

      const newBounds = new LatLngBounds(southWest, northEast);

      setBounds(newBounds);
      map.setMinZoom(0);
      map.fitBounds(newBounds, { animate: false });
      map.setMinZoom(map.getZoom());
      map.setMaxBounds(newBounds);

      imageOverlayRef.classList.add('show');
      onLoad?.(e);
    },
  };

  useEffect(
    () => () => {
      refElement?.classList.remove('show');
      onUnload?.();
    },
    [props.url] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <StyledImageOverlay
      ref={innerRef}
      key={props.url}
      bounds={bounds}
      eventHandlers={imageOverlayEventsHandler}
      {...props}>
      {!refElement?.classList.contains('show') && <StyledLoadingSpinner />}
      {children}
    </StyledImageOverlay>
  );
};

export default forwardRef(AnimatedImageOverlay);
