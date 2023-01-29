/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLeafletContext } from '@react-leaflet/core';
import { LeafletEventHandlerFnMap } from 'leaflet';
import { useEffect } from 'react';

type Props = {
  [k in keyof LeafletEventHandlerFnMap]: LeafletEventHandlerFnMap[k];
};

const usePopupContainerEvents = (events: Props) => {
  const leafletContext = useLeafletContext();
  const popupContainer = leafletContext.overlayContainer || leafletContext.map;

  useEffect(() => {
    const eventsEntries = Object.entries(events);

    eventsEntries.forEach(([eventName, eventHandler]) => popupContainer.on(eventName as any, eventHandler as any));
    return () =>
      eventsEntries.forEach(([eventName, eventHandler]) => popupContainer.off(eventName as any, eventHandler as any));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { leafletContext, popupContainer };
};

export default usePopupContainerEvents;
