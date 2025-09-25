import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import { generateRandomFileName } from 'src/shared/helper';
import { existsSync, mkdirSync } from 'fs';
import { UPLOAD_DIR } from 'src/shared/constants/other.const';
import { MediaService } from './media.service';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    console.log(file)
    const newFileName = generateRandomFileName(file.originalname)
    cb(null, file.fieldname + '-' + newFileName)
  }
})


@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports: [
    MulterModule.register({
      storage
    })
  ]
})
export class MediaModule {
  constructor() {
    if(!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, {recursive: true}) // recursive : tạo folder cha nếu chưa tồn tại
    }
  }
}
