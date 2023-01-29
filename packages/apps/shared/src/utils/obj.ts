export const nullKeyToEmptyString = (entity: object | object[]) =>
  JSON.parse(
    JSON.stringify(entity, (_, val) => {
      if (val === null) {
        return '';
      }
      return val;
    })
  );

export const emptyStringKeyToNull = (entity: object | object[]) =>
  JSON.parse(
    JSON.stringify(entity, (_, val) => {
      if (val === '') {
        return null;
      }
      return val;
    })
  );
