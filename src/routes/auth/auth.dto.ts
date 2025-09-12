
import { createZodDto } from 'nestjs-zod'
import { ForgotPasswordBodySchema, getAuthorizationUrlResSchema, loginBodySchema, LoginResShema, logoutBodySchema, RefreshTokenBodySchema, RefreshTokenResSchema, RegisterBodySchema, RegisterResSchema, sendOTPBodySchema } from './auth.model';
import { create } from 'domain';
import { extend } from 'zod/mini';

export class RegisterResponseDTO extends createZodDto(RegisterResSchema) {}

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class SendOTPBodyDTO extends createZodDto(sendOTPBodySchema) {}

export class LoginBodyDTO extends createZodDto(loginBodySchema) {}

export class LoginResDTO extends createZodDto(LoginResShema) {}

export class RefreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}

export class RefreshTokenResDTO extends createZodDto(RefreshTokenResSchema) {}

export class LogoutBodyDTO extends createZodDto(logoutBodySchema) {}

export class GetAuthorizationUrlResDTO extends createZodDto(getAuthorizationUrlResSchema) {}

export class ForgotPasswordBodyDTO extends createZodDto(ForgotPasswordBodySchema) {}