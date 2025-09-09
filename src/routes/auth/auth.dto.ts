
import { createZodDto } from 'nestjs-zod'
import { loginBodySchema, LoginResShema, RegisterBodySchema, RegisterResSchema, sendOTPBodySchema } from './auth.model';

export class RegisterResponseDTO extends createZodDto(RegisterResSchema) {}

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class SendOTPBodyDTO extends createZodDto(sendOTPBodySchema) {}

export class LoginBodyDTO extends createZodDto(loginBodySchema) {}

export class LoginResDTO extends createZodDto(LoginResShema) {}



