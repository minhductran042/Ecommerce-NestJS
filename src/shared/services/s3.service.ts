import { GetObjectCommand, PutObjectCommand, S3, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import envConfig from "../config";
import { Upload } from "@aws-sdk/lib-storage";
import { readFileSync } from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mime from "mime-types";


@Injectable()
export class S3Service {
    private s3: S3
    constructor() {
        this.s3 = new S3({
            region: envConfig.S3_REGION,
            credentials: {
                accessKeyId: envConfig.S3_ACCESS_KEY,
                secretAccessKey: envConfig.S3_SECRET_KEY
            }
        })
        // this.s3.listBuckets({}).then((res) => {
        //     console.log(res)
        // })
    }

    uploadFile({
        fileName,
        filePath,
        contentType
    } : {
        fileName: string,
        filePath: string, 
        contentType: string
    }) {
        try {
            const parallelUploads3 = new Upload({
                client: this.s3,
                params: { Bucket: envConfig.S3_BUCKET_NAME, Key: fileName, Body: readFileSync(filePath), ContentType: contentType  },
                tags: [
                /*...*/
                ],
                // additional optional fields show default values below:
                // (optional) concurrency configuration
                queueSize: 4,

                // (optional) size of each part, in bytes, at least 5MB
                partSize: 1024 * 1024 * 5,

                // (optional) when true, do not automatically call AbortMultipartUpload when
                // a multipart upload fails to complete. You should then manually handle
                // the leftover parts.
                leavePartsOnError: false,
            });

            // parallelUploads3.on("httpUploadProgress", (progress) => {
            //     console.log(progress);
            // });

            return parallelUploads3.done();
        } catch (e) {
            console.log(e);
        }
    }


    createPresignedUrlWithClient = (fileName : string) => {
        const client = this.s3;
        const ContentType =mime.lookup(fileName) || 'application/octet-stream';
        const command = new PutObjectCommand({ Bucket: envConfig.S3_BUCKET_NAME, Key: fileName, ContentType: ContentType });
        return getSignedUrl(client, command, { expiresIn: 3600 });
    };
}

// const s3Instance = new S3Service();
// s3Instance.uploadFile({
//     fileName: 'images/test.jpg',
//     filePath: 'D:\\PersonalProject\\Ecommerce_NestJS\\server\\upload\\files-5bd1f81d-866f-40b0-83a3-a45e43f77d5a.png',
//     contentType: 'image/png'
// })?.then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// })