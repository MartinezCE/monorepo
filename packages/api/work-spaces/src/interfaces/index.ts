export enum FileTypes {
  'DOCUMENT' = 'DOCUMENT',
  'IMAGE' = 'IMAGE',
}

export interface FileAttributes {
  id?: number;
  type: FileTypes;
  url: string;
  mimetype: string;
  name: string;
  key: string;
}

export interface AmenityAttributes {
  id?: number;
  amenityId?: number;
}

export interface S3File extends Express.Multer.File {
  key: string;
  location: string;
}

export interface GooglePeopleResponse {
  resourceName: string;
  etag: string;
}

export interface GooglePeoplePhoneNumberResponse extends GooglePeopleResponse {
  phoneNumbers?: {
    metadata: object;
    value: string;
    canonicalForm: string;
    type: string;
    formattedType: string;
  }[];
}

export interface ModelTimestamps {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
