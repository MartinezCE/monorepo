import { AddressType, Client } from '@googlemaps/google-maps-services-js';

const client = new Client();

export default class GoogleMapsService {
  static async getDataFromLatLng(lat: number, lng: number) {
    const { data } = await client.reverseGeocode({
      params: { key: process.env.GOOGLE_MAPS_API_KEY, latlng: { lat, lng } },
    });

    const { address_components: address } = data.results[0];

    const streetName = address.find(item => item.types.includes(AddressType.route))?.long_name || '';
    const streetNumber = address.find(item => item.types.includes(AddressType.street_number))?.short_name || '';
    const city = address.find(item => item.types.includes(AddressType.locality))?.long_name || '';
    const state = address.find(item => item.types.includes(AddressType.administrative_area_level_1))?.long_name || '';
    const country = address.find(item => item.types.includes(AddressType.country))?.long_name || '';
    const postalCode = address.find(item => item.types.includes(AddressType.postal_code))?.short_name || '';

    const formattedAddress = [`${streetName} ${streetNumber}`.trim(), city, state, country].filter(Boolean).join(', ');

    return { streetName, streetNumber, city, state, country, postalCode, formattedAddress };
  }
}
