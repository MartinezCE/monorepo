/* eslint-disable consistent-return */
import { Button, Select, images, SpaceTypeEnum, spaceTypeFilterLabels } from '@wimet/apps-shared';
import styled from 'styled-components';
import { Marker } from 'react-leaflet';
import { ButtonIconMixin } from '@wimet/apps-shared/lib/common/mixins';
import { useMemo, useState } from 'react';
import Blueprint from '../../UI/Blueprint';
import useBlueprintToolbar, {
  MarkerProps,
  MarkerRefProps,
  MODES,
  LayerPoint,
} from '../../../hooks/useBlueprintToolbar';
import Toolbar from './Toolbar';
import useFilterOptions from './useFilterOptions';
import { useGetSeats, useGetSeatsWithoutPoint } from '../../../hooks/api/useGetSeats';
import BlueprintContainer from './BlueprintContainer';
import useSeatMarkers, { seatToMarker } from '../../../hooks/useSeatMarkers';
import useGetMarkerIcon, { getSpaceTypeMarker, MarkerVariants } from '../../../hooks/useGetMarkerIcon';
import BlueprintSeatPopover from '../../BlueprintSeatPopover';
import DeleteSeatModal from './DeleteSeatModal';
import ModifyBlueprintModal from './ModifyBlueprintModal';
import CustomHeader from './CustomHeader';

const SeatWithoutMarkerOverlay = styled.div<{ position: LayerPoint | null }>`
  min-width: 200px;
  position: absolute;
  background-color: white;
  padding: 18px;
  border-radius: 8px;
  border: solid 1px ${({ theme }) => theme.colors.extraLightGray};
  box-shadow: ${({ theme }) => theme.shadows[0]};
  top: ${({ position }) => `${position ? position?.y + 10 : 0}px`};
  left: ${({ position }) => `${position ? position?.x + 10 : 0}px`};
  z-index: 100;

  .seat-name {
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.darkGray};
  }

  .seat-type {
    font-size: 16px;
    font-weight: 300;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 20px;
  margin-bottom: 32px;
`;

const StyledToolbarWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 20px;
  position: absolute;
  z-index: 5;
  padding: 20px 0 0 20px;

  .custom-dropdown-select-seats-section {
    min-width: 220px;

    & .react-select__control {
      border: unset !important;
      box-shadow: ${({ theme }) => theme.shadows[1]};
    }
  }
`;

const StyledModifyBlueprintIcon = styled(Button)`
  ${ButtonIconMixin};
`;

const SelectSeatsSection = ({ section = '' }: { section?: string }) => {
  const { currentLocation, currentBlueprint, currentFloor, floorOptions, handleFilters } = useFilterOptions();
  const [showModifyBlueprintModal, setShowModifyBlueprintModal] = useState(false);
  const [seatEditData, setSeatEditData] = useState<MarkerProps | null>(null);
  const [seatDeleteData, setSeatDeleteData] = useState<MarkerProps | null>(null);
  const [selectedSeatNoPoint, setSelectedSeatNoPoint] = useState<{ value: number; label: string } | null>(null);
  const { data = [] } = useGetSeats(currentBlueprint?.id, { includeAmenities: true });
  const seatsWithoutPoint = useGetSeatsWithoutPoint(data);
  const markers = useSeatMarkers(data);
  const getMarkerIcon = useGetMarkerIcon();
  const {
    setImageOverlay,
    markerRefs,
    handleChange,
    mode,
    setMode,
    addSeatCoordinates,
    setAddSeatCoordinates,
    clickLayerPoints,
    handleSetClickLayerPoints,
    handlePopoverScroll,
    applyFloatPopover,
    mousePosistion,
    resetMousePosition,
  } = useBlueprintToolbar({ markers });

  const filteredFloorOptions = useMemo(
    () => floorOptions.filter(f => !!f.blueprints.filter(b => b.url).length),
    [floorOptions]
  );

  const handleSetMarkerMode = (marker: MarkerProps) => {
    if (mode === MODES.EDIT) return setSeatEditData(marker);
    if (mode === MODES.DELETE) return setSeatDeleteData(marker);
  };

  const handleMarkerClick = (e: L.LeafletMouseEvent, m: MarkerRefProps) => {
    handleSetClickLayerPoints({ x: e.originalEvent.pageX, y: e.originalEvent.pageY });
    handleSetMarkerMode(m);
    handlePopoverScroll(e.originalEvent.pageY);
  };

  const handleOnCloseModal = () => {
    handleSetClickLayerPoints(null);
    if (!mode) return;
    if (mode === MODES.EDIT) return setSeatEditData(null);
    if (mode === MODES.ADD) return setAddSeatCoordinates(null);
    if (mode === MODES.DELETE) return setSeatDeleteData(null);
    if (mode === MODES.ADD_MIGRATED) {
      setSeatEditData(null);
      setSelectedSeatNoPoint(null);
      resetMousePosition();
      return setAddSeatCoordinates(null);
    }
  };

  const handleMigratedSeat = async (selectedSeat: typeof seatsWithoutPoint[number]) => {
    const seat = data.find(s => s.id === selectedSeat.value);
    if (!seat) return;
    applyFloatPopover();

    setSelectedSeatNoPoint(selectedSeat);
    setMode(MODES.ADD_MIGRATED);
    setSeatEditData(seatToMarker(seat));
  };

  const addNewMarker = clickLayerPoints && addSeatCoordinates;

  return (
    <>
      <BlueprintContainer showOverlay={!currentBlueprint?.url}>
        <StyledHeader>
          <CustomHeader locationName={currentLocation.label} section={section} />
          <Toolbar handleChange={handleChange} mode={mode} />
        </StyledHeader>
        <StyledToolbarWrapper>
          <Select
            className='custom-dropdown-select-seats-section'
            options={filteredFloorOptions}
            value={currentFloor || null}
            onChange={e => handleFilters(e as { value: string }, 'floorId')}
            name='floorId'
            instanceId='floorOptions'
          />
          <StyledModifyBlueprintIcon
            variant='secondary'
            leadingIcon={<images.TinyEdit />}
            onClick={() => setShowModifyBlueprintModal(true)}
          />
          {!!seatsWithoutPoint.length && (
            <Select
              className='custom-dropdown-select-seats-section'
              options={seatsWithoutPoint}
              onChange={selected => handleMigratedSeat(selected as typeof seatsWithoutPoint[number])}
              name='unasignedSeat'
              instanceId='unasignedSeatsOptions'
              placeholder='Asientos sin asignar'
              value={selectedSeatNoPoint}
            />
          )}
        </StyledToolbarWrapper>
        <Blueprint setImageOverlay={setImageOverlay} imageOverlayUrl={currentBlueprint?.url} isOverlayInteractive>
          {markers
            .filter(m => m.pos)
            .map((m, i) => {
              const variant = !m.isAvailable
                ? MarkerVariants.UNAVAILABLE
                : getSpaceTypeMarker(m.spaceType as SpaceTypeEnum);

              return (
                <Marker
                  key={m.id}
                  ref={ref => {
                    if (!ref) return;
                    markerRefs.current[i] = { ...m, ref };
                  }}
                  position={m.pos}
                  icon={getMarkerIcon({ variant })}
                  eventHandlers={{
                    click: e => handleMarkerClick(e, m),
                  }}
                />
              );
            })}
          {addNewMarker && (
            <Marker
              key='new-marker'
              position={addSeatCoordinates}
              icon={getMarkerIcon({ variant: MarkerVariants.ADDING })}
            />
          )}
        </Blueprint>
      </BlueprintContainer>

      {(addSeatCoordinates || (mode !== MODES.ADD_MIGRATED && seatEditData)) && (
        <BlueprintSeatPopover
          position={clickLayerPoints}
          blueprintId={currentBlueprint?.id}
          seatsData={seatEditData}
          onClose={handleOnCloseModal}
          addSeatCoordinates={addSeatCoordinates}
        />
      )}

      {selectedSeatNoPoint && mousePosistion && (
        <SeatWithoutMarkerOverlay position={mousePosistion}>
          <p className='seat-name'>{seatEditData?.name}</p>
          <p className='seat-type'>{spaceTypeFilterLabels[seatEditData?.spaceType as SpaceTypeEnum]}</p>
        </SeatWithoutMarkerOverlay>
      )}

      {seatDeleteData && <DeleteSeatModal onClose={handleOnCloseModal} seat={seatDeleteData} />}

      {showModifyBlueprintModal && (
        <ModifyBlueprintModal
          blueprintId={currentBlueprint?.id}
          onClose={() => setShowModifyBlueprintModal(false)}
          currentBlueprintURL={currentBlueprint?.url}
        />
      )}
    </>
  );
};

export default SelectSeatsSection;
