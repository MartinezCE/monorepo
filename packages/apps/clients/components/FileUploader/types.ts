const BLUEPRINT = 'blueprint';
const BULK_SEATS = 'bulk-seats';

export type FileUploaderUseCases = typeof BLUEPRINT | typeof BULK_SEATS;

export const PNG = 'image/png';
export const JPEG = 'image/jpeg';
export const JPG = 'image/jpg';
export const CSV = 'text/csv';

export const acceptedFileTypes = {
  [BLUEPRINT]: [PNG, JPEG, JPG],
  [BULK_SEATS]: [CSV],
};
