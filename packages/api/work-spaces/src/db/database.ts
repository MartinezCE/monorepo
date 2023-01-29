/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
import { Model, ModelOptions, Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { Umzug, SequelizeStorage } from 'umzug';
import { isArray, upperFirst } from 'lodash';
import * as config from './config';
import logger from '../helpers/logger';

const types = ['HasOne', 'HasMany', 'BelongsToMany'];

dotenv.config();

const database = new Sequelize(config[process.env.NODE_ENV]);

const loggerInstance = logger('database-controller');

const isParanoid = model => model.options?.paranoid;
const getAssociations = instance => {
  const { singular, plural } = instance.constructor.options.name;
  const { associations } = database.models[singular] || database.models[plural];

  return associations;
};
const isBelongsToMany = association => association.associationType === 'BelongsToMany';
const isSoftCascade = association => types.includes(association.associationType);

const cascadeSoftDelete = async (instance, cb) => {
  if (!isParanoid(instance?.constructor)) return;
  const associations = getAssociations(instance);

  for (const assoc of Object.keys(associations)) {
    // @ts-ignore
    const { singular, plural } = associations[assoc].options.name;
    // @ts-ignore
    const through = associations[assoc].options.through?.model;
    const model = database.models[singular] || database.models[plural];
    const isJoinTableSoftDelete = isBelongsToMany(associations[assoc]) && isParanoid(through);

    if (!isSoftCascade(associations[assoc]) || (!isParanoid(model) && !isJoinTableSoftDelete)) continue;
    cb(instance, assoc, associations);
  }
};

// Abstract common logic
database.addHook(
  'beforeDestroy',
  async <T extends Model>(instance: T & { constructor: { options: ModelOptions<T> } }) => {
    cascadeSoftDelete(instance, async (_instance, assoc, associations) => {
      try {
        if (isBelongsToMany(associations[assoc])) {
          await _instance[`set${upperFirst(assoc)}`]([]);
        } else {
          const res = await _instance[`get${upperFirst(assoc)}`]();

          if (isArray(res)) {
            await Promise.all(res.map(r => r?.destroy?.()));
          } else {
            loggerInstance.info(associations[assoc]);

            await res?.destroy?.();
          }
        }
      } catch (error) {
        loggerInstance.error(error);
      }
    });
  }
);

database.addHook(
  'afterRestore',
  async <T extends Model>(instance: T & { constructor: { options: ModelOptions<T> } }) => {
    cascadeSoftDelete(instance, async (_instance, assoc, associations) => {
      try {
        if (isBelongsToMany(associations[assoc])) {
          const res = await instance?.[`get${upperFirst(assoc)}`]?.({ through: { paranoid: false } });
          // @ts-ignore
          const throughModel = associations?.[assoc]?.options?.through?.model;

          await Promise.all((res || []).map(r => r?.[throughModel]?.restore?.()));
        } else {
          const res = await instance?.[`get${upperFirst(assoc)}`]?.({ paranoid: false });

          if (isArray(res)) {
            await Promise.all(res.map(r => r?.restore?.()));
          } else {
            await res?.restore?.();
          }
        }
      } catch (error) {
        loggerInstance.error(error);
      }
    });
  }
);

export const umzug = new Umzug({
  migrations: {
    glob: 'migrations/*.js',
    resolve: ({ name, path, context }) => {
      // eslint-disable-next-line import/no-dynamic-require
      const migration = require(path);
      return {
        name,
        up: async () => migration.up(context, Sequelize),
        down: async () => migration.down(context, Sequelize),
      };
    },
  },
  context: database.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: database }),
  logger: console,
});

export default database;
