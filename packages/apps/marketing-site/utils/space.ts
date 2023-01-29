import { pluralize, Space, SpaceReservationType, SpaceType, SpaceTypeEnum } from '@wimet/apps-shared';

export const getSpaceReferencePrice = (space?: Space, spaceTypes?: SpaceType[]) => {
  const fullDayCreditsWithFee = space?.hourly?.find(s => s.fullDayCreditsWithFee)?.fullDayCreditsWithFee || 0;
  const isHourly = space?.spaceReservationType?.value === SpaceReservationType.HOURLY;
  const pricesConfig = {
    [SpaceTypeEnum.SHARED]: fullDayCreditsWithFee,
    [SpaceTypeEnum.PRIVATE_OFFICE]: fullDayCreditsWithFee,
    [SpaceTypeEnum.MEETING_ROOM]: space?.hourly?.find(s => s.dayCreditsWithFee)?.dayCreditsWithFee || 0,
  };

  const spaceType = spaceTypes?.find(({ id }) => id === space?.spaceTypeId)?.value || SpaceTypeEnum.SHARED;
  const cost = isHourly ? pluralize(pricesConfig[spaceType], 'crédito', true) : `$${space?.monthly?.price}`;

  let priceText;
  if (!isHourly) priceText = '/ mes';
  else if (spaceType === SpaceTypeEnum.MEETING_ROOM) priceText = '/ hora';
  else priceText = '/ día';

  const show = (isHourly ? pricesConfig[spaceType] : space?.monthly?.price || 0) > 0;

  return {
    show,
    priceText,
    cost,
  };
};

export const showPeopleCapacity = (space?: Partial<Space>, spaceTypes?: SpaceType[]) =>
  space &&
  !!space.peopleCapacity &&
  space.spaceTypeId !== (spaceTypes || [])?.find(item => item.value === SpaceTypeEnum.SHARED)?.id;
