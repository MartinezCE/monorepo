import plural from 'rosaenlg-pluralize-es';

export const pluralize = (count: number, word: string, inclusive?: boolean) => {
  const parsedWord = count === 1 ? word : plural(word);
  return inclusive ? `${count} ${parsedWord}` : parsedWord;
};
