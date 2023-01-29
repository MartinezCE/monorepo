/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderToString } from 'react-dom/server';
import ThemeProvider from '../ThemeProvider';
import GMapOverlayView, { EventFunc, Events } from './GMapOverlayView';

type GMapMarkerProps = {
  lat?: number;
  lng?: number;
  position?: google.maps.LatLng | google.maps.LatLngLiteral;
  children: React.ReactElement;
  map?: google.maps.Map | google.maps.StreetViewPanorama;
  hasClusterer?: boolean;
  clickable?: boolean;
  zIndex?: number;
  _metadata?: unknown;
};

type CustomEvents = Events | 'remove';

export default class GMapMarker extends GMapOverlayView {
  map: google.maps.Map | google.maps.StreetViewPanorama;

  position: google.maps.LatLng | google.maps.LatLngLiteral;

  marker: HTMLDivElement;

  componentWrapper: HTMLDivElement;

  htmlComponent: string;

  _metadata: any;

  events: { [k in CustomEvents]?: EventFunc[] } = {};

  zIndex = 0;

  clickable = false;

  visible = true;

  constructor(opts?: GMapMarkerProps) {
    super();
    this.init();

    if (opts) return this.setOptions(opts);
    return this;
  }

  getDraggable = () => {};

  getPosition = () => this.position;

  getVisible = () => this.visible;

  setVisible(value: boolean) {
    this.visible = value;
    return this;
  }

  private init() {
    this.marker = document.createElement('div');
    this.componentWrapper = document.createElement('div');

    this.setDefaultStyles();
    this.marker.appendChild(this.componentWrapper);
  }

  private setDefaultStyles() {
    this.marker.style.position = 'absolute';

    this.componentWrapper.style.position = 'absolute';
    this.componentWrapper.style.left = '0';
    this.componentWrapper.style.top = '0';
    this.componentWrapper.style.transform = 'translate(-50%, -50%)';
  }

  private updateStyles() {
    this.marker.style.zIndex = `${this.zIndex}`;
    this.marker.style.cursor = this.clickable ? 'pointer' : 'unset';
  }

  /** @ts-ignore */
  private addListener(event: CustomEvents, func: EventFunc) {
    this.marker.addEventListener(event, func);
  }

  private removeListener(event: CustomEvents, func: EventFunc) {
    this.marker.removeEventListener(event, func);
  }

  private addAllListeners() {
    Object.keys(this.events).forEach((e: CustomEvents) => this.events[e].forEach(f => this.addListener(e, f)));
  }

  private removeAllListeners() {
    Object.keys(this.events).forEach((e: CustomEvents) => this.events[e].forEach(f => this.removeListener(e, f)));
  }

  setOptions({
    lat: _lat,
    lng: _lng,
    position,
    children,
    map,
    hasClusterer,
    clickable,
    zIndex,
    _metadata,
  }: GMapMarkerProps) {
    if (!position && !(_lat && _lng)) throw new Error("('position') or ('lat' and 'lng') is required");

    const lat = (typeof position?.lat === 'function' ? position.lat() : position?.lat) ?? _lat;
    const lng = (typeof position?.lng === 'function' ? position.lng() : position?.lng) ?? _lng;

    this.position = new google.maps.LatLng(lat, lng);
    this.htmlComponent = renderToString(<ThemeProvider>{children}</ThemeProvider>);
    this.clickable = clickable ?? this.clickable;
    this.zIndex = zIndex ?? this.zIndex;
    this._metadata = _metadata ?? this._metadata;

    this.updateStyles();

    if (!hasClusterer) this.setMap(map);
    return this;
  }

  addEventListener(event: CustomEvents, func: EventFunc) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(func);
    return this;
  }

  removeEventListener(event: CustomEvents, func: EventFunc) {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(f => f !== func);
    return this;
  }

  onAdd() {
    if (!this.visible) return;

    this.componentWrapper.innerHTML = this.htmlComponent;
    this.addAllListeners();
    this.getPanes().overlayMouseTarget.appendChild(this.marker);
  }

  draw() {
    const position = this.getProjection().fromLatLngToDivPixel(this.position);
    this.marker.style.left = `${position.x}px`;
    this.marker.style.top = `${position.y}px`;
  }

  onRemove() {
    if (!this.marker.parentNode?.removeChild) return;
    this.events.remove?.forEach(f => f());
    this.removeAllListeners();
    this.marker.parentNode.removeChild(this.marker);
  }
}
