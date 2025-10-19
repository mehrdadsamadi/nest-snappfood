import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export function UploadFileS3(fieldName: string) {
  return class UploadUtility extends FileInterceptor(fieldName, {
    storage: memoryStorage(),
  }) {};
}

export function uploadFileFieldsS3(uploadFields: MulterField[]) {
  return class UploadUtility extends FileFieldsInterceptor(uploadFields, {
    storage: memoryStorage(),
  }) {};
}
