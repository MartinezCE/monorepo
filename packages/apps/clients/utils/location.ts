import { ClientLocation } from '@wimet/apps-shared';

export const getLocationBlueprints = (location?: Partial<ClientLocation>) =>
  (location?.floors || []).flatMap(floor => floor.blueprints.map(blueprint => ({ ...blueprint, floor })));
