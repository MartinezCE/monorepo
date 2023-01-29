import { LeafletEvent, Layer } from 'leaflet';

export const getElementFromEvent = <T extends Layer, R = HTMLElement>(e: LeafletEvent) => {
  const target = e.target as T & { getElement: () => R };
  const ref = target?.getElement();
  return { target, ref };
};
