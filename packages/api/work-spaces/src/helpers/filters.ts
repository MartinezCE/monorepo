import { isUndefined, omitBy, pick } from 'lodash';
import { Model } from 'sequelize';
import { ParsedQs } from 'qs';

export default class FiltersHelper {
  static clean<T extends ParsedQs | { [key: string]: number }>(model: Partial<typeof Model>, filters: T) {
    return omitBy<Pick<T, keyof T>>(pick<T, keyof T>(filters, Object.keys(model.rawAttributes)), isUndefined);
  }
}
