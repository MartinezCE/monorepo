import axios from 'axios';
import { find } from 'geo-tz';

export default class TimezoneService {
  // TODO: Migrate to GoogleMapsService.getDataFromLatLng
  private static async getLatLng(state: string, country: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${state},${country}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const { data: locationData } = await axios.get(encodeURI(url));
    return locationData.results[0].geometry.location as { lat: number; lng: number };
  }

  private static getTimezoneByCoords(lat: number, lng: number) {
    return find(lat, lng)[0];
  }

  static async getTimezone(state: string, country: string): Promise<string>;
  static async getTimezone(lat: number, lng: number): Promise<string>;
  static async getTimezone(stateOrLat: string | number, lngOrCountry?: string | number): Promise<string> {
    let lat: number;
    let lng: number;

    if (typeof stateOrLat === 'string') {
      ({ lat, lng } = await this.getLatLng(stateOrLat as string, lngOrCountry as string));
    } else {
      lat = stateOrLat as number;
      lng = lngOrCountry as number;
    }

    return this.getTimezoneByCoords(lat, lng);
  }
}
