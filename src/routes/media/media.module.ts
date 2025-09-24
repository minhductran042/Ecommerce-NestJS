import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import { generateRandomFileName } from 'src/shared/helper';

const uploadDir = path.resolve('upload')
// console.log(uploadDir)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    console.log(file)
    const newFileName = generateRandomFileName(file.originalname)
    cb(null, file.fieldname + '-' + newFileName)
  }
})


@Module({
  controllers: [MediaController],
  imports: [
    MulterModule.register({
      storage
    })
  ]
})
export class MediaModule {}
