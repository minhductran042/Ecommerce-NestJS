import { Body, ClassSerializerInterceptor, Controller, HttpCode, HttpStatus, Post, SerializeOptions, UseGuards, UseInterceptors, Req, Ip, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetAuthorizationUrlResDTO, LoginBodyDTO, LoginResDTO, LogoutBodyDTO, RefreshTokenBodyDTO, RefreshTokenResDTO, RegisterBodyDTO, RegisterResponseDTO, SendOTPBodyDTO } from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserAgent } from 'src/shared/decorator/user-agent.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { IsPublic } from 'src/shared/decorator/isPublic.decorator';
import { GoogleService } from './google.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly googleService: GoogleService
    ) {}

    @Post('register')
    @IsPublic()
    @ZodSerializerDto(RegisterResponseDTO)
    async register(@Body() body: RegisterBodyDTO ) {
        return  await this.authService.register(body)
    }


    @Post('otp')
    @IsPublic()
    @ZodSerializerDto(MessageResDTO)
    async sendOTP(@Body() body: SendOTPBodyDTO ) {
        return  await this.authService.sendOTP(body)
    }

    @Post('login')
    @IsPublic()
    @ZodSerializerDto(LoginResDTO)
    async login(@Body() body: LoginBodyDTO , @UserAgent() userAgent: string , @Ip() ip: string) {
        return await this.authService.login({
            ...body,
            userAgent,
            ip
        })
    }

    @Post('refresh-token')
    @IsPublic()
    @HttpCode(HttpStatus.OK)
    @ZodSerializerDto(RefreshTokenResDTO)
    refreshToken(@Body() body: RefreshTokenBodyDTO , @UserAgent() userAgent: string , @Ip() ip: string) {
        return this.authService.refreshToken({
            refreshToken: body.refreshToken, 
            userAgent,
            ip
        })
    }

    @Post('logout')
    @ZodSerializerDto(MessageResDTO)
    async logout(@Body() body: LogoutBodyDTO) {
        return await this.authService.logout(body);
    }

    @Get('google-link')
    @ZodSerializerDto(GetAuthorizationUrlResDTO)
    @IsPublic()
    getAuthorizationUrl(@UserAgent() userAgent: string , @Ip() ip: string) {
        // console.log('UserAgent:', userAgent);
        // console.log('IP:', ip);
        return this.googleService.getAuthorizationUrl({userAgent, ip});
    }
}
