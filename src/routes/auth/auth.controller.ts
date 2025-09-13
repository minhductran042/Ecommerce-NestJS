import { Body, ClassSerializerInterceptor, Controller, HttpCode, HttpStatus, Post, SerializeOptions, UseGuards, UseInterceptors, Req, Ip, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DisableTwoFactorBodyDTO, ForgotPasswordBodyDTO, GetAuthorizationUrlResDTO, LoginBodyDTO, LoginResDTO, LogoutBodyDTO, RefreshTokenBodyDTO, RefreshTokenResDTO, RegisterBodyDTO, RegisterResponseDTO, SendOTPBodyDTO } from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserAgent } from 'src/shared/decorator/user-agent.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { IsPublic } from 'src/shared/decorator/isPublic.decorator';
import { GoogleService } from './google.service';
import express from 'express';
import envConfig from 'src/shared/config';

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
        return this.googleService.getAuthorizationUrl({userAgent, ip});
    }


    @Get('google/callback')
    @IsPublic()
    async googleCallback(@Query('code') code : string,  @Query('state') state : string, @Res() res: express.Response) {
        try {
            const data = await this.googleService.handleGoogleCallback( { code, state }) 
            return res.redirect(`${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error happenned when login with Google'
            return res.redirect(`${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?errorMessage=${message}`)
        }
    }

    @Post('forgot-password')
    @IsPublic()
    @ZodSerializerDto(MessageResDTO)
    forgotPassword(@Body() body : ForgotPasswordBodyDTO) {
        return this.authService.forgotPassword(body);
    }


    @Post('2fa/disable')
    disable2FA(@Body() Body : DisableTwoFactorBodyDTO) {
        return 
    }
}
