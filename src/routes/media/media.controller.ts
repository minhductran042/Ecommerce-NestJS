import { BadRequestException, Controller, FileTypeValidator, Get, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import express from 'express';
import path from 'path';
import envConfig from 'src/shared/config';
import { UPLOAD_DIR } from 'src/shared/constants/other.const';
import { IsPublic } from 'src/shared/decorator/isPublic.decorator';

@Controller('media')
export class MediaController {
    
    @Post('/images/upload')
    @UseInterceptors(
      FilesInterceptor('files' , 10, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 2MB
      }
    }))
        uploadFile(@UploadedFiles( new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024  }), // 2MB
      ]
    })) files: Array<Express.Multer.File>) {
        
      // console.log(files);
      return files.map(file => ({
         url: `${envConfig.PREFIX_STATIC_ENDPOINT}/${file.filename}`
      }))

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
}
