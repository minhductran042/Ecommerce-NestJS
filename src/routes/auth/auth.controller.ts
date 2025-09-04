import { Body, ClassSerializerInterceptor, Controller, HttpCode, HttpStatus, Post, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { RegisterBodyDTO, RegisterResponseDTO } from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ZodSerializerDto(RegisterResponseDTO)
    async register(@Body() body: RegisterBodyDTO) {
        return  await this.authService.register(body)
    }

    @Post('login')
    async login(@Body() body: any) {
        return await this.authService.login(body)
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() body: any) {
        return await this.authService.refreshToken(body.refreshToken)
    }

    @Post('logout')
    async logout(@Body() body: any) {
        return await this.authService.logout(body.refreshToken);
    }
}
