import { BadRequestException, Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import express from 'express';
import path from 'path';
import envConfig from 'src/shared/config';
import { UPLOAD_DIR } from 'src/shared/constants/other.const';
import { IsPublic } from 'src/shared/decorator/isPublic.decorator';
import { S3Service } from 'src/shared/services/s3.service';
import { MediaService } from './media.service';
import { ParseFilePipeWithUnlink } from './parse-file-pipe-with-unlink.pipe';

@Controller('media')
export class MediaController {

    constructor(private readonly mediaService: MediaService) {}
    
    @Post('/images/upload')
    @UseInterceptors(
      FilesInterceptor('files' , 10, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 2MB
      }
    }))
    async uploadFile(@UploadedFiles( 
      new ParseFilePipeWithUnlink({
        validators: [
          new MaxFileSizeValidator({ maxSize: 128  }), // 2MB
        ]
      })
    ) files: Array<Express.Multer.File>) {

      return this.mediaService.uploadFile(files)
        

      
      // console.log(files);
      // return files.map(file => ({
      //    url: `${envConfig.PREFIX_STATIC_ENDPOINT}/${file.filename}`
      // }))

    }


    @Get('static/:filename') 
    @IsPublic()
    serveFile(@Param('filename') filename: string, @Res() res: express.Response) {
      return res.sendFile(path.resolve(UPLOAD_DIR, filename), error => {
        const notfound = new NotFoundException('File not found')
        res.status(404).send({
          message: notfound.message,
          path: 'filename',
          code: notfound.getStatus()
        })
      })
    }


    @Post('images/upload/presign-url')
    @IsPublic()
    async createPresignUrl(@Body() body: {fileName: string}) {
      return this.mediaService.getPresignUrl(body)
    }
}
