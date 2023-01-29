/* eslint-disable consistent-return */
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import React, { useEffect, useMemo, useState } from 'react';
import styled, { css, DefaultTheme, Interpolation, ThemeProps } from 'styled-components';
import GMapMarker from '../GMapMarker';
import { CustomInfoWindow, Options } from '../../hooks/useInfoWindow';
import { EventFunc } from '../GMapMarker/GMapOverlayView';

type StyledDefaultMarkerProps = {
  variant?: 'unselected' | 'selected' | 'hovered';
};

const config: { [k in StyledDefaultMarkerProps['variant']]: Interpolation<ThemeProps<DefaultTheme>> } = {
  unselected: css`
    background-color: ${({ theme }) => theme.colors.darkGray};
  `,
  selected: css`
    width: 20px;
    height: 20px;
    background-color: ${({ theme }) => theme.colors.blue};
    outline: 5px solid ${({ theme }) => theme.colors.blueOpacity20};
  `,
  hovered: css`
    background-color: ${({ theme }) => theme.colors.blue};
  `,
};

const StyledDefaultMarker = styled.div<StyledDefaultMarkerProps>`
  width: 20px;
  height: 20px;
  border-radius: 999px;
  ${({ variant }) => config[variant]}
`;

type Props = {
  map: google.maps.Map;
  clusterer?: MarkerClusterer;
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  defaultMarkerVariant?: StyledDefaultMarkerProps['variant'];
  onClick?: () => void;
  clickable?: boolean;
  children?: React.ReactNode;
  infoWindow?: { instance: CustomInfoWindow; opts: Options };
  _metadata?: unknown;
};

export default function Marker({
  map,
  clusterer,
  position,
  defaultMarkerVariant = 'selected',
  onClick,
  clickable,
  children,
  infoWindow: { instance: infoWindow, opts: infoWindowOpts } = {} as Props['infoWindow'],
  _metadata,
}: Props) {
  const [marker] = useState(new GMapMarker());

  const markerComponent = useMemo(() => {
    if (children) return <>{children}</>;
    return <StyledDefaultMarker variant={defaultMarkerVariant} />;
  }, [children, defaultMarkerVariant]);

  useEffect(() => {
    if (!map) return;
    marker.setOptions({
      position,
      map,
      hasClusterer: !!clusterer,
      clickable: !!onClick || clickable,
      children: markerComponent,
      _metadata,
    });

    const handleClick: EventFunc = e => {
      infoWindow?.handleMarkerClick({ position, ...infoWindowOpts })?.(e);
      onClick?.();
    };
    const handleRemove = () => infoWindow?.close();

    marker.addEventListener('click', handleClick);
    marker.addEventListener('remove', handleRemove);

    return () => {
      marker.removeEventListener('click', handleClick);
      marker.removeEventListener('remove', handleRemove);
    };
  }, [_metadata, clickable, clusterer, infoWindow, infoWindowOpts, map, marker, markerComponent, onClick, position]);

  useEffect(() => {
    if (!clusterer) return;
    clusterer.addMarker(marker as unknown as google.maps.Marker);

    return () => {
      clusterer?.removeMarker(marker as unknown as google.maps.Marker);
    };
  }, [clusterer, marker]);

  return null;
}
