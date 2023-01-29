import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import { s3 } from './s3';

dotenv.config();

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_LOCATIONS_BUCKET,
    key(_, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});
