export const removeAccents = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '');
