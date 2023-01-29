import { useEffect } from 'react';
import type { Cluster, MarkerClusterer } from '@googlemaps/markerclusterer';
import { CustomInfoWindow, GetInfoWindowOpts, GMapMarker, WPMReservation } from '@wimet/apps-shared';

const shouldOpenMarkerInfoWindow = (cluster: Cluster) => cluster.markers?.length === 1;
const findCluster = (clusterer: MarkerClusterer, reservationId: number) => {
  const { clusters } = clusterer as unknown as { clusters: Cluster[] };
  return clusters.find(c =>
    c.markers?.some(m => {
      const marker = m as unknown as GMapMarker;
      const reservation = marker._metadata as WPMReservation;
      return reservation.id === reservationId;
    })
  );
};
const openInfoWindow = (
  infoWindow: CustomInfoWindow,
  position: google.maps.LatLng | null | undefined,
  getInfoWindowOpts: GetInfoWindowOpts,
  metadata: WPMReservation[]
) => {
  infoWindow.setOptions({ position, ...getInfoWindowOpts(metadata) });
  infoWindow.open();
};

type Props = {
  map: google.maps.Map;
  markerInfoWindow: CustomInfoWindow;
  markerGetInfoWindowOpts: GetInfoWindowOpts;
  markerClusterer?: MarkerClusterer;
  clustererInfoWindow: CustomInfoWindow;
  clustererGetInfoWindowOpts?: GetInfoWindowOpts;
  selectedReservationId: number;
};

const useLiveMapSelectedReservation = ({
  map,
  markerInfoWindow,
  markerGetInfoWindowOpts,
  markerClusterer,
  clustererInfoWindow,
  clustererGetInfoWindowOpts,
  selectedReservationId,
}: Props) => {
  useEffect(() => {
    if (!map || !markerClusterer) return;
    const cluster = findCluster(markerClusterer as unknown as MarkerClusterer, selectedReservationId);

    if (!cluster) return;

    const clustererMarker = cluster.marker;
    const markers = (cluster.markers || []) as unknown as GMapMarker[];
    const position = clustererMarker.getPosition();

    if (shouldOpenMarkerInfoWindow(cluster)) {
      const [marker] = markers;
      if (!marker) return;
      const metadata = [marker._metadata] as WPMReservation[];
      openInfoWindow(markerInfoWindow, position, markerGetInfoWindowOpts, metadata);
    } else {
      if (!clustererGetInfoWindowOpts) return;
      const metadata = markers.map<WPMReservation>(m => m._metadata);
      openInfoWindow(clustererInfoWindow, position, clustererGetInfoWindowOpts, metadata);
    }
  }, [
    clustererGetInfoWindowOpts,
    clustererInfoWindow,
    map,
    markerClusterer,
    markerGetInfoWindowOpts,
    markerInfoWindow,
    selectedReservationId,
  ]);
};

export default useLiveMapSelectedReservation;
