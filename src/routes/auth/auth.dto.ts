
import { createZodDto } from 'nestjs-zod'
import { RegisterBodySchema, RegisterResSchema, sendOTPBodySchema } from './auth.model';

export class RegisterResponseDTO extends createZodDto(RegisterResSchema) {}

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class SendOTPBodyDTO extends createZodDto(sendOTPBodySchema) {}