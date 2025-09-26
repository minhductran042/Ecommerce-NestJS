import { Injectable } from "@nestjs/common";
import { S3Service } from "src/shared/services/s3.service";
import fs, { unlink } from 'fs';
import { generateRandomFileName } from "src/shared/helper";

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


    async getPresignUrl(body: {fileName: string}) {
      const randomFileName = generateRandomFileName(body.fileName)
      const presignedUrl = await this.s3Service.createPresignedUrlWithClient(randomFileName)
      const url = presignedUrl.split('?')[0]
      return { presignedUrl , url}
    }
}
