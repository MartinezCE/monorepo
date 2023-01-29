export function getNullpercentage(obj: object, ignore: string[] = []) {
  const objectKeys = Object.keys(obj);
  const nullKeys = objectKeys.filter(k => {
    const el = obj[k];
    if (ignore.includes(k)) return false;
    if (k === 'deletedAt') return false;
    if (el === null) return true;
    if (Array.isArray(el) && !el.length) return true;
    return false;
  });

  return {
    percentage: (1 - nullKeys.length / objectKeys.length).toFixed(2),
    nextNullField: nullKeys[0] || null,
  };
}

export const getClientLocationNullPercentage = (obj: object) => getNullpercentage(obj, ['locationsAmenities']);
export const getSpaceNullPercentage = (obj: object) => getNullpercentage(obj, ['order']);
