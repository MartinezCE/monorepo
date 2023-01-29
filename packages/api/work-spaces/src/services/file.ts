import { Model, ModelStatic, WhereOptions } from 'sequelize/dist';
import { s3 } from '@wimet/api-shared';
import { FileAttributes, FileTypes, S3File } from '../interfaces';

export default class FileService {
  static async addFiles<T extends Model>(
    model: ModelStatic<T>,
    files: S3File[],
    attributes?: (f: S3File) => Partial<T['_creationAttributes']>
  ) {
    return model.bulkCreate(
      files.map(f => ({
        name: f.originalname,
        key: f.key,
        mimetype: f.mimetype,
        url: f.location,
        ...attributes(f),
      }))
    );
  }

  static async removeFile<T extends Model<FileAttributes, FileAttributes> & FileAttributes>(
    model: ModelStatic<T>,
    fileId: number,
    where: Partial<WhereOptions<T['_attributes']>>
  ) {
    const file = await model.findOne({
      where: {
        id: fileId,
        ...where,
      },
      rejectOnEmpty: true,
    });

    FileService.removeFileFromS3(file.key);
    await file.destroy();
  }

  static groupFileByType<T extends Model<FileAttributes, FileAttributes> & FileAttributes>(files: T[]) {
    return files.reduce((acc, curr) => {
      const key = `${FileTypes[curr.type].toLowerCase()}s`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);
      return acc;
    }, {} as { [key in `${Lowercase<FileTypes>}s`]: T[] });
  }

  static removeFileFromS3(key) {
    s3.deleteObject({ Bucket: process.env.AWS_LOCATIONS_BUCKET, Key: key }, err => {
      if (err) {
        console.error('There was an error removing the file from s3', err);
      }
    });
  }
}
