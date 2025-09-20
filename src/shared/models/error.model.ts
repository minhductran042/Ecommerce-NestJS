import { NotFoundException } from "@nestjs/common";

export const NotFoundRecordException = new NotFoundException({
    message: 'Record not found'
})