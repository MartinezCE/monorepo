import React, { useRef, useState, useEffect, ComponentPropsWithoutRef } from 'react';
import Input from '../Input';

export type SearchProps = {
  lat: number;
  lng: number;
  formattedAddress: string;
  streetName: string;
  streetNumber: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  viewport: google.maps.LatLngBounds;
};

type PlacesDropdownProps = ComponentPropsWithoutRef<typeof Input> & {
  map: google.maps.Map;
  shouldCenter?: boolean;
  onSearch?: (props: SearchProps) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const PlacesDropdown: React.FC<PlacesDropdownProps> = ({ map, shouldCenter = true, onSearch, ...props }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isAutocompleteEnabled, setIsAutocompleteEnabled] = useState(false);

  const handleSearch = (_props: SearchProps) => {
    if (shouldCenter) {
      map.setCenter({ lat: _props.lat, lng: _props.lng });
      map.fitBounds(_props.viewport);
    }

    onSearch?.(_props);
  };

  useEffect(() => {
    if (ref.current && map && !isAutocompleteEnabled) {
      setIsAutocompleteEnabled(true);

      const autocomplete = new google.maps.places.Autocomplete(ref.current);

      autocomplete?.addListener('place_changed', () => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { geometry, address_components } = autocomplete.getPlace();

        if (!geometry?.location) return;

        const streetName = address_components.find(item => item.types.includes('route'))?.long_name || '';
        const streetNumber = address_components.find(item => item.types.includes('street_number'))?.short_name || '';
        const city = address_components.find(item => item.types.includes('locality'))?.long_name || '';
        const state =
          address_components.find(item => item.types.includes('administrative_area_level_1'))?.long_name || '';
        const country = address_components.find(item => item.types.includes('country'))?.long_name || '';
        const postalCode = address_components.find(item => item.types.includes('postal_code'))?.short_name || '';

        const formattedAddress = [`${streetName} ${streetNumber}`.trim(), city, state, country]
          .filter(Boolean)
          .join(', ');

        handleSearch({
          lat: geometry.location.lat(),
          lng: geometry.location.lng(),
          formattedAddress,
          streetName,
          streetNumber,
          city,
          state,
          country,
          postalCode,
          viewport: geometry.viewport,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return <Input ref={ref} {...props} />;
};

export default PlacesDropdown;
