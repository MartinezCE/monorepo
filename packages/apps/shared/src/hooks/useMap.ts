import { useState, useEffect } from 'react';

const styles = [
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#444444' }] },
  { featureType: 'landscape', elementType: 'all', stylers: [{ color: '#f2f2f2' }] },
  { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'all', stylers: [{ saturation: -100 }, { lightness: 45 }] },
  { featureType: 'road.highway', elementType: 'all', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'all', stylers: [{ color: '#dde6e8' }, { visibility: 'on' }] },
];

const useMap = ({
  center = { lat: 0, lng: 0 },
  defaultAddress,
  zoom,
  maxZoom,
  onClick,
  onBoundsChanged,
  onDragStart,
}: {
  zoom?: number;
  maxZoom?: number;
  defaultAddress?: string;
  center?: { lat: number; lng: number };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onBoundsChanged?: (map: google.maps.Map) => void;
  onDragStart?: (map: google.maps.Map) => void;
}) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map>();

  const initMap = async () => {
    if (!ref || map) return;

    let fetchedDefaultAddress: google.maps.GeocoderResult | null = null;

    if (defaultAddress) {
      try {
        const newGeocoder = new google.maps.Geocoder();
        const { results } = await newGeocoder.geocode({ address: defaultAddress });
        [fetchedDefaultAddress] = results;
      } catch (error) {
        console.warn('There was an error fetching the default address', error);
      }
    }

    const newMap = new google.maps.Map(ref, {
      center: fetchedDefaultAddress?.geometry?.location || center,
      zoom: zoom || (fetchedDefaultAddress?.geometry?.viewport ? null : 2),
      maxZoom,
      disableDefaultUI: true,
      styles,
    });

    if (fetchedDefaultAddress?.geometry?.viewport) {
      newMap.fitBounds(fetchedDefaultAddress.geometry.viewport);
    }

    if (onClick) newMap.addListener('click', onClick);
    if (onBoundsChanged) newMap.addListener('bounds_changed', () => onBoundsChanged(newMap));
    if (onDragStart) newMap.addListener('dragstart', () => onDragStart(newMap));
    setMap(newMap);
  };

  useEffect(() => {
    initMap();
  }, [ref]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    map,
    ref,
    setRef,
  };
};

export default useMap;
