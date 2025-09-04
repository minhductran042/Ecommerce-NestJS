import { BadRequestException, UnprocessableEntityException } from '@nestjs/common'
import { createZodValidationPipe } from 'nestjs-zod'
import { ZodError } from 'zod'

const MyZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    return new UnprocessableEntityException({
      errors: error.issues.map((err) => ({
        ...err,
        path: err.path.join('.'),
        code: err.code,
      })),
    });
  }
})

export default (MyZodValidationPipe as unknown as any)