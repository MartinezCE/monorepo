import { Seat } from '@wimet/apps-shared';
import L, { LatLng } from 'leaflet';
import { useMemo } from 'react';
import { MarkerRefProps } from './useBlueprintToolbar';

export const seatToMarker = (s: Seat): MarkerRefProps => ({
  name: s.name,
  reservations: s.WPMReservations,
  amenities: s.amenities,
  isAvailable: s.isAvailable,
  id: s.id.toString(),
  pos: s.geometry ? L.latLng(s.geometry.coordinates[0], s.geometry.coordinates[1]) : new LatLng(0, 0),
  ref: null,
  spaceType: s.spaceType?.value,
  spaceTypeId: s.spaceTypeId,
});

const useSeatMarkers = (seats: Seat[] = []) =>
  useMemo(() => seats.filter(s => s.geometry).map<MarkerRefProps>(seatToMarker), [seats]);

export default useSeatMarkers;
