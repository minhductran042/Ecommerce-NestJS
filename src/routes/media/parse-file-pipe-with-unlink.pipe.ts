import { ParseFileOptions, ParseFilePipe } from "@nestjs/common";
import { error } from "console";
import { unlink } from "fs";

export class ParseFilePipeWithUnlink extends ParseFilePipe {
    constructor(option?: ParseFileOptions) {
        super(option)
    }
    async transform(files: Array<Express.Multer.File>): Promise<any> {
        console.log(files)
        return super.transform(files).catch(async error => {
            await Promise.all(files.map(file => unlink(file.path, (err) => {
                if(err) {
                    console.log(err);
                }
            })))
            console.log(error)
            throw error
        })
    }
}