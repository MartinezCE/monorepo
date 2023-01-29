import { SpaceCardLayout, blueprintStatusLabels, Blueprint } from '@wimet/apps-shared';
import { Seat } from '@wimet/apps-shared/src/types/api';
import { useRouter } from 'next/router';
import BlueprintDetailsItem from '../WorkplaceManagerPage/BlueprintDetailsItem';

type Props = {
  blueprints: Blueprint[];
  locationId: string;
  onDelete?: (blueprint: Blueprint) => void;
};

const countType = (seats: Seat[]) => {
  let countDeskt = 0;
  let countMeeting = 0;
  let countPrivate = 0;
  seats.forEach(seat => {
    if (seat.spaceTypeId === 1) {
      countDeskt += 1;
    }
    if (seat.spaceTypeId === 2) {
      countMeeting += 1;
    }
    if (seat.spaceTypeId === 3) {
      countPrivate += 1;
    }
  });
  return { countDeskt, countMeeting, countPrivate };
};

const LocationsBlueprintsByFloor = ({ blueprints, locationId, onDelete }: Props) => {
  const router = useRouter();

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', rowGap: 24 }}>
        {blueprints.map(blueprint => {
          const available = blueprint?.seats?.filter(s => !!s.isAvailable).length || 0;
          const occupied = blueprint?.seats?.filter(s => !s.isAvailable).length || 0;

          const floorDetailsRoute = `/workplace-manager/locations/${locationId}/floor/${blueprint.floorId}?blueprintId=${blueprint.id}`;
          const floorEditRoute = `/workplace-manager/locations/${locationId}/edit?floorId=${blueprint.floorId}`;

          return (
            <SpaceCardLayout
              countSeats={countType(blueprint?.seats as Seat[])}
              key={blueprint.id}
              spaceTitle={`${blueprint.floor.number}`}
              spaceSubtitle={`Piso ${blueprint.floor.number}`}
              status={blueprint.status}
              statusText={blueprintStatusLabels[blueprint.status]}
              addActionsSpace
              handleClickDetails={() => router.push(floorDetailsRoute)}
              onEditHref={blueprint.url ? floorEditRoute : floorDetailsRoute}
              onDelete={() => onDelete?.(blueprint)}
              statusFullWidth>
              <BlueprintDetailsItem
                avaliable={available}
                occupied={occupied}
                href={`${locationId}/edit?step=2&blueprintId=${blueprint.id}&floorId=${blueprint.floor.id}`}
              />
            </SpaceCardLayout>
          );
        })}
      </div>
    </>
  );
};
export default LocationsBlueprintsByFloor;
