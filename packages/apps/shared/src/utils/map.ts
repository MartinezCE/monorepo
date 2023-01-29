import { DEGREE_TO_RADIAN, EARTH_RADIUS } from '../constants';

export const getRadiusFromBounds = (bounds: google.maps.LatLngBounds) => {
  // degrees to radians (divide by 57.2958)
  const neLat = bounds.getNorthEast().lat() / DEGREE_TO_RADIAN;
  const neLng = bounds.getNorthEast().lng() / DEGREE_TO_RADIAN;
  const cLat = bounds.getCenter().lat() / DEGREE_TO_RADIAN;
  const cLng = bounds.getCenter().lng() / DEGREE_TO_RADIAN;
  // distance = circle radius from center to Northeast corner of bounds
  const radiusInKM =
    EARTH_RADIUS *
    Math.acos(Math.sin(cLat) * Math.sin(neLat) + Math.cos(cLat) * Math.cos(neLat) * Math.cos(neLng - cLng));

  return radiusInKM;
};
