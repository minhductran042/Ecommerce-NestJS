import { UnprocessableEntityException } from "@nestjs/common";

export const LanguageAlreadyExistsError = new UnprocessableEntityException({
    message: 'Language has already exists',
    path: 'id'
})