import logger from './logger';

/* eslint-disable no-restricted-syntax */
const childrenTypes = ['HasOne', 'HasMany', 'BelongsToMany'];

const loggerInstance = logger('sequelize-helper');

// Use this function to log the associations of a model
export const getMagicMethods = (model, onlyChildrenAssociations?: boolean) => {
  for (const assoc of Object.keys(model.associations)) {
    if (onlyChildrenAssociations && childrenTypes.includes(model.associations[assoc].associationType)) {
      for (const accessor of Object.keys(model.associations[assoc].accessors)) {
        loggerInstance.info(`${model.name}.${model.associations[assoc].accessors[accessor]}()`);
      }
    }
  }
};
