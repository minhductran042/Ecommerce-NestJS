import { Injectable } from "@nestjs/common";
import { S3Service } from "src/shared/services/s3.service";
import fs, { unlink } from 'fs';

@Injectable()
export class MediaService {
    constructor(private readonly s3Service: S3Service) {}

    async uploadFile(files: Array<Express.Multer.File>) {
        const result = await Promise.all(
          files.map(file => {
           return this.s3Service.uploadFile({
            fileName: "images/" + file.filename,
            filePath: file.path,
            contentType: file.mimetype
          })?.then(res => {
            return {
              url: res.Location
            }
          })
        })
      )
      //Xoa file sau khi upload len s3

      await Promise.all(files.map(file => {
        return unlink(file.path, (err) => {
          if(err) {
            console.log(err);
          }
        })
      }))

      return result
    }
}
