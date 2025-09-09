import { Body, ClassSerializerInterceptor, Controller, HttpCode, HttpStatus, Post, SerializeOptions, UseGuards, UseInterceptors, Req, Ip } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDTO, RegisterBodyDTO, RegisterResponseDTO, SendOTPBodyDTO } from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserAgent } from 'src/shared/decorator/user-agent.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    @ZodSerializerDto(RegisterResponseDTO)
    async register(@Body() body: RegisterBodyDTO ) {
        return  await this.authService.register(body)
    }


    
    @Post('otp')
    async sendOTP(@Body() body: SendOTPBodyDTO ) {
        return  await this.authService.sendOTP(body)
    }

    @Post('login')
    async login(@Body() body: LoginBodyDTO , @UserAgent() userAgent: string , @Ip() ip: string) {
        return await this.authService.login({
            ...body,
            userAgent,
            ip
        })
    }

    // @Post('refresh-token')
    // @HttpCode(HttpStatus.OK)
    // async refreshToken(@Body() body: any) {
    //     return await this.authService.refreshToken(body.refreshToken)
    // }

    // @Post('logout')
    // async logout(@Body() body: any) {
    //     return await this.authService.logout(body.refreshToken);
    // }
}
