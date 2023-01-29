import { useCallback, useRef, useState } from 'react';
import { LatLng } from 'leaflet';
import { Amenity, SpaceTypeEnum, WPMReservation } from '@wimet/apps-shared';
import { toast } from 'react-toastify';
import { updateSeat } from './api/useUpdateSeat';

export type MarkerProps = {
  name?: string;
  reservations?: WPMReservation[];
  amenities?: Amenity[];
  isAvailable?: boolean;
  id?: string;
  pos: L.LatLng;
  spaceType?: SpaceTypeEnum;
  spaceTypeId?: number;
};

export type MarkerRefProps = {
  ref: L.Marker | null;
} & MarkerProps;

export enum MODES {
  ADD = 'ADD',
  MOVE = 'MOVE',
  DELETE = 'DELETE',
  EDIT = 'EDIT',
  ADD_MIGRATED = 'ADD_MIGRATE',
}

export type LayerPoint = {
  x: number;
  y: number;
};

type Props = {
  markers?: MarkerRefProps[];
};

const useBlueprintToolbar = ({ markers = [] }: Props) => {
  const [addSeatCoordinates, setAddSeatCoordinates] = useState<LatLng | null>(null);
  const [clickLayerPoints, setClickLayerPoints] = useState<LayerPoint | null>(null);
  const [mousePosistion, setMousePosition] = useState<LayerPoint | null>(null);
  const [mode, setMode] = useState<MODES | null>(null);
  const imageOverlayRef = useRef<L.ImageOverlay | null>(null);
  const markerRefs = useRef<MarkerRefProps[]>(markers);

  const setImageOverlay = useCallback((overlay: L.ImageOverlay | null) => {
    imageOverlayRef.current = overlay;
  }, []);

  const handleSetClickLayerPoints = useCallback((points: LayerPoint | null) => setClickLayerPoints(points), []);

  const handlePopoverScroll = useCallback((pageY: number) => {
    const rootHtml = document.querySelector('body') as HTMLElement;
    const header = document.getElementById('BaseHeaderApp') as HTMLElement;
    const OFFSET_PADDING = 20;

    window.scrollTo({
      top: pageY - (header?.offsetHeight + OFFSET_PADDING || 100),
      left: rootHtml?.scrollWidth,
      behavior: 'smooth',
    });
  }, []);

  const onClick = useCallback((e: L.LeafletMouseEvent) => {
    const { pageX, pageY } = e.originalEvent;

    setClickLayerPoints({ x: pageX, y: pageY });
    setAddSeatCoordinates(e.latlng);

    handlePopoverScroll(pageY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrag = useCallback(async (e: L.DragEndEvent) => {
    const marker = markerRefs.current.find(m => m.ref === e.target);
    const imageOverlayBounds = imageOverlayRef.current?.getBounds();

    if (!marker || !imageOverlayBounds) return;

    const newPos = e.target.getLatLng();
    const currentPos = marker.pos;

    if (!imageOverlayBounds.contains(newPos)) {
      marker.ref?.setLatLng(currentPos);
      toast.error('El asiento no puede estar fuera del plano');
      return;
    }

    const newValues = {
      name: marker?.name,
      isAvailable: marker?.isAvailable,
      amenities: marker.amenities?.map(a => a.id) || [],
      geometry: { coordinates: [newPos.lat, newPos.lng] as [number, number], type: 'Point' },
    };

    try {
      await updateSeat({ seatId: marker?.id || '', payload: newValues });
      marker.pos = newPos;
    } catch (_) {
      marker.ref?.setLatLng(currentPos);
    }
  }, []);

  const onMouseMove = useCallback((e: L.LeafletMouseEvent) => {
    const { pageX, pageY } = e.originalEvent;
    setMousePosition({ x: pageX, y: pageY });
  }, []);

  const onMouseOver = useCallback((e: L.LeafletMouseEvent) => {
    if (mousePosistion) return;
    onMouseMove(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseOut = useCallback(() => setMousePosition(null), []);

  const resetFloatPopover = () => {
    const overlay = imageOverlayRef.current;
    overlay?.off('mouseout', onMouseOut);
    overlay?.off('mousemove', onMouseMove);
    overlay?.off('mouseover', onMouseOver);
  };

  const resetAll = (el: HTMLElement) => {
    el.classList.remove('move');
    el.classList.remove('crosshair');

    const overlay = imageOverlayRef.current;
    overlay?.off('click', onClick);

    markerRefs.current.forEach(({ ref }) => {
      ref?.dragging?.disable();
      ref?.off('dragend', onDrag);
    });

    if (mousePosistion) resetFloatPopover();
  };

  const applyFloatPopover = () => {
    const overlay = imageOverlayRef.current;
    const el = imageOverlayRef.current?.getElement();

    if (!overlay || !el) return;

    resetAll(el);

    el.classList.add('crosshair');
    overlay.on('click', onClick);
    overlay.on('mouseout', onMouseOut);
    overlay.on('mousemove', onMouseMove);
    overlay.on('mouseover', onMouseOver);
  };

  const applyStyles = (newMode: MODES | null) => {
    const overlay = imageOverlayRef.current;
    const el = imageOverlayRef.current?.getElement();

    if (!overlay || !el) return;

    resetAll(el);

    if (!newMode) return;

    if ([MODES.ADD, MODES.ADD_MIGRATED].includes(newMode)) {
      el.classList.add('crosshair');

      overlay.on('click', onClick);
      return;
    }

    if (newMode === MODES.MOVE) {
      el.classList.add('move');

      markerRefs.current.forEach(({ ref }) => {
        ref?.on('dragend', onDrag);
        ref?.dragging?.enable();
      });
    }
  };

  const handleChange = (newMode: MODES) => {
    const isSameMode = mode === newMode;
    const finalMode = !isSameMode ? newMode : null;
    setMode(finalMode);
    applyStyles(finalMode);
  };

  const handleSetMode = (newMode: MODES | null) => {
    setMode(newMode);
    applyStyles(newMode);
  };

  return {
    setImageOverlay,
    handleChange,
    markerRefs,
    mode,
    setMode: handleSetMode,
    addSeatCoordinates,
    setAddSeatCoordinates,
    clickLayerPoints,
    handleSetClickLayerPoints,
    handlePopoverScroll,

    applyFloatPopover,
    mousePosistion,
    resetMousePosition: () => {
      setMousePosition(null);
      resetFloatPopover();
    },
  };
};

export default useBlueprintToolbar;
