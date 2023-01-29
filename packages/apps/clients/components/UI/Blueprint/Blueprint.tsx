import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import L from 'leaflet';
import { MapContainer, ZoomControl } from 'react-leaflet';
import defaultMarkerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import defaultMarkerIcon from 'leaflet/dist/images/marker-icon.png';
import defaultMarkerShadow from 'leaflet/dist/images/marker-shadow.png';
import AnimatedImageOverlay from './AnimatedImageOverlay';

delete (L.Icon.Default.prototype as any)._getIconUrl; // eslint-disable-line @typescript-eslint/no-explicit-any
L.Icon.Default.mergeOptions({
  iconUrl: defaultMarkerIcon.src,
  iconRetinaUrl: defaultMarkerIcon2x.src,
  shadowUrl: defaultMarkerShadow.src,
});

const StyledBlueprintWrapper = styled.div`
  height: 670px;
  position: relative;
  padding-top: 28px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.white};
  opacity: 1;
  background-image: radial-gradient(#dddddd 1.4px, #ffffff 1.4px);
  background-size: 28px 28px;
`;

const StyledMapContainer = styled(MapContainer)`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  z-index: 0;
  position: relative;
  opacity: 1;
  background-image: radial-gradient(#dddddd 1.4px, #ffffff 1.4px);
  background-size: 28px 28px;

  &.leaflet-container {
    overflow-y: show !important;
  }

  .leaflet-control-container .leaflet-right {
    margin-right: 20px;
  }

  & .leaflet-control-zoom {
    margin: 0;
    border: unset;
    background-color: white;
    box-shadow: ${({ theme }) => theme.shadows[1]};

    & .leaflet-control-zoom-in {
      border-bottom: unset;

      &::after {
        content: '';
        width: 85%;
        height: 1px;
        background-color: ${({ theme }) => theme.colors.lightGray};
        display: block;
        margin: auto;
        position: absolute;
        bottom: 50%;
        left: 0;
        right: 0;
      }
    }

    & .leaflet-control-zoom-in,
    & .leaflet-control-zoom-out {
      color: ${({ theme }) => theme.colors.orange} !important;
      line-height: 25px;

      &.leaflet-disabled {
        color: #bbb !important;
      }
    }
  }
`;

type Props = {
  className?: string;
  children?: ReactNode;
  setMap?: (map: L.Map) => void;
  center?: L.LatLng;
  zoom?: number;
  setImageOverlay?: (overlay: L.ImageOverlay | null) => void;
  imageOverlayUrl: string;
  isOverlayInteractive?: boolean;
  hideZoomControl?: boolean;
};

const Blueprint = ({
  className,
  children,
  setMap,
  center = new L.LatLng(0, 0),
  zoom = 0,
  setImageOverlay,
  imageOverlayUrl,
  isOverlayInteractive,
  hideZoomControl = false,
}: Props) => {
  const [imageOverlayLoaded, setImageOverlayLoaded] = useState(false);

  return (
    <StyledBlueprintWrapper className={className}>
      <StyledMapContainer
        ref={ref => ref && setMap?.(ref)}
        center={center}
        zoom={zoom}
        crs={L.CRS.Simple}
        attributionControl={false}
        maxZoom={1.5}
        maxBoundsViscosity={0.5}
        zoomSnap={0.25}
        zoomDelta={0.25}
        scrollWheelZoom={false}
        zoomControl={false}>
        <AnimatedImageOverlay
          ref={ref => ref && setImageOverlay?.(ref)}
          url={imageOverlayUrl}
          onLoad={() => setImageOverlayLoaded(true)}
          onUnload={() => setImageOverlayLoaded(false)}
          interactive={isOverlayInteractive}
        />
        {imageOverlayLoaded && children}
        {!hideZoomControl && <ZoomControl position='topright' />}
      </StyledMapContainer>
    </StyledBlueprintWrapper>
  );
};
export default Blueprint;
