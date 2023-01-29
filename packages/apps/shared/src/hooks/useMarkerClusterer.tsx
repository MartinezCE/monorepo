/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useEffect, useMemo, useState } from 'react';
import {
  Cluster,
  MarkerClusterer as GMapMarkererClusterer,
  onClusterClickHandler,
  SuperClusterAlgorithm,
} from '@googlemaps/markerclusterer';
import type supercluster from 'supercluster';
import GMapMarker from '../components/GMapMarker';
import useInfoWindow, { Options } from './useInfoWindow';

export type GetInfoWindowOpts = (metadata: any[]) => Options;

type Props = {
  map: google.maps.Map;
  clustererComponent?: (count: number) => React.ReactElement;
  onClusterClick?: onClusterClickHandler;
  algorithmOpts?: supercluster.Options<GeoJSON.GeoJsonProperties, GeoJSON.GeoJsonProperties>;
  getInfoWindowOpts?: GetInfoWindowOpts;
};

const useMarkerClusterer = ({
  map,
  clustererComponent,
  onClusterClick,
  algorithmOpts = {},
  getInfoWindowOpts,
}: Props) => {
  const [markerClusterer, setMarkerClusterer] = useState<GMapMarkererClusterer | null>(null);
  const infoWindow = useInfoWindow({ map });

  const renderer = useMemo(
    () => ({
      render: ({ position, count, markers }: Cluster) => {
        const m = new GMapMarker();

        m.setOptions({
          map,
          position,
          hasClusterer: true,
          clickable: true,
          zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          children: clustererComponent(count),
        });

        if (getInfoWindowOpts) {
          const opts = getInfoWindowOpts((markers as unknown as GMapMarker[]).map(marker => marker._metadata));
          m.addEventListener('click', infoWindow.handleMarkerClick({ position, ...opts }));
          m.addEventListener('remove', infoWindow.handleMarkerRemove);
        }

        return m as unknown as google.maps.Marker;
      },
    }),
    [clustererComponent, getInfoWindowOpts, map]
  );

  useEffect(() => {
    if (!map) return;

    const algorithm = new SuperClusterAlgorithm(algorithmOpts);
    const clusterer = new GMapMarkererClusterer({ map, onClusterClick, algorithm, renderer });

    setMarkerClusterer(clusterer);
  }, [algorithmOpts, map, onClusterClick, renderer]);

  return { markerClusterer, infoWindow };
};

export default useMarkerClusterer;
