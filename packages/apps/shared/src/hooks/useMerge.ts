/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import deepmerge from 'deepmerge';
import { isArray, isUndefined, omitBy } from 'lodash';

type TUnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export const customMergeOmittingUndefined: deepmerge.Options['customMerge'] = () => (obj, src) =>
  deepmerge(obj, !isArray(src) ? omitBy(src, isUndefined) : src, { customMerge: customMergeOmittingUndefined });

export default function useMerge<T extends Record<string, unknown>[]>(objects: T, options?: deepmerge.Options) {
  const mergedObject = useMemo(() => deepmerge.all(objects, options), [objects, options]) as TUnionToIntersection<
    T[number]
  >;
  return mergedObject;
}
