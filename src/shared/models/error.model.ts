import { NotFoundException } from "@nestjs/common";

export const NotFoundExceptionRecord = new NotFoundException({
    message: 'Record not found'
})