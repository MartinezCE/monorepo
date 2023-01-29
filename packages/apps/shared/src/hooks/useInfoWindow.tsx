/* eslint-disable consistent-return */
import { ReactElement, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import { ThemeProvider } from '../components';
import { EventFunc } from '../components/GMapMarker/GMapOverlayView';

export type Options = Omit<google.maps.InfoWindowOptions, 'content'> & {
  content: ReactElement;
  id?: string;
  onOpen?: () => void;
  onClose?: () => void;
};

export type CustomInfoWindow = {
  setOptions: (opts: Options) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  handleMarkerClick: (opts: Options) => EventFunc;
  handleMarkerRemove: () => void;
};

type Props = {
  map: google.maps.Map;
};

const isInfoWindowOpen = infoWindow => {
  const map = infoWindow.getMap();
  return map !== null && typeof map !== 'undefined';
};

const useInfoWindow = ({ map }: Props): CustomInfoWindow => {
  const optionsRef = useRef<Options>();
  const infoWindowRef = useRef<google.maps.InfoWindow>();
  const infoWindowEventRef = useRef<google.maps.MapsEventListener>();

  const setOptions = useCallback((opts: Options) => {
    optionsRef.current = { ...opts, content: <ThemeProvider>{opts.content}</ThemeProvider> };

    const { current: infoWindow } = infoWindowRef;
    const { content: component, id } = optionsRef.current;

    infoWindowEventRef.current?.remove();
    infoWindowEventRef.current = infoWindow.addListener('domready', () => {
      if (!id) return;
      ReactDOM.render(component, document.getElementById(id).parentElement);
    });
  }, []);

  const open = useCallback(() => {
    const { current: infoWindow } = infoWindowRef;
    const { content: component, pixelOffset, position, onOpen } = optionsRef.current;
    const content = renderToString(component);
    infoWindow.setOptions({ content, position, pixelOffset });
    infoWindow.open({ map, shouldFocus: true });
    onOpen?.();
  }, [map]);

  const close = useCallback(() => {
    const { current: infoWindow } = infoWindowRef;
    const { onClose } = optionsRef.current || {};
    infoWindow.close();
    onClose?.();
  }, []);

  const toggle = useCallback(() => {
    const { current: infoWindow } = infoWindowRef;
    if (isInfoWindowOpen(infoWindow)) return close();
    return open();
  }, [open, close]);

  const handleMarkerClick: (opts: Options) => EventFunc = useCallback(
    opts => e => {
      e.cancelBubble = true;
      e.stopPropagation();
      setOptions(opts);
      open();
    },
    [open, setOptions]
  );

  const handleMarkerRemove = useCallback(() => close(), [close]);

  useEffect(() => {
    if (!map) return;
    infoWindowRef.current = infoWindowRef.current ?? new google.maps.InfoWindow();

    const { current: infoWindowEvent } = infoWindowEventRef;
    const mapClickEvent = map.addListener('click', close);

    return () => {
      close();
      infoWindowEvent?.remove();
      mapClickEvent.remove();
    };
  }, [close, map]);

  return { setOptions, open, close, toggle, handleMarkerClick, handleMarkerRemove };
};

export default useInfoWindow;
