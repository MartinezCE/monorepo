/* eslint-disable @typescript-eslint/no-empty-interface */
import { assignIn } from 'lodash';

export type Events = keyof HTMLElementEventMap;
export type EventFunc = (event?: HTMLElementEventMap[Events]) => void;

interface GMapOverlayView extends google.maps.OverlayView {
  addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
  addListener(this: GMapOverlayView, eventName: Events, func: EventFunc): void;
}

class GMapOverlayView {
  constructor() {
    assignIn(GMapOverlayView.prototype, google.maps.OverlayView.prototype);
  }
}

export default GMapOverlayView;
