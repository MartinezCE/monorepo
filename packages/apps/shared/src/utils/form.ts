import { isArray, isString, values } from 'lodash';
import * as Yup from 'yup';

export const mergeSchemas = <T extends Yup.AnySchema>(
  schemas: T[]
): Yup.AnySchema<Yup.TypeOf<T>, Yup.SchemaOf<T>, Yup.Asserts<T>> => {
  const [first, ...rest] = schemas;
  return rest.reduce((acc, schema) => acc.concat(schema.required()), first.required());
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getError = (error?: string | string[] | object): any => {
  if (!error) return null;
  if (isString(error)) return error;
  if (isArray(error)) return getError(error.find(e => !!e));
  return getError(values(error).find(e => !!e));
};
