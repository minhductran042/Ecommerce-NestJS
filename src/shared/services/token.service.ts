import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import envConfig from '../config';
import { AccessTokenPayloadCreate, RefreshTokenPayLoad, RefreshTokenPayloadCreate, AccessTokenPayload  } from '../types/jwt.type';
import { uuidv4 } from 'zod';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    signAccessToken(payload: AccessTokenPayloadCreate) {
        return this.jwtService.sign({...payload, uuid: uuidv4()}, {
            secret: envConfig.ACCESS_TOKEN_SECRET,
            expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN,
            algorithm: 'HS256',
        })
    }

    signRefreshToken(payload: RefreshTokenPayloadCreate) {
        return this.jwtService.sign({...payload, uuid: uuidv4()}, {
            secret: envConfig.REFRESH_TOKEN_SECRET,
            expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN,
            algorithm: 'HS256',
        })
    }

    verifyAccessToken(token: string) : Promise<AccessTokenPayload> // Đảm bảo rằng token trả về có kiểu AccessTokenPayload{
    { 
        return this.jwtService.verifyAsync(token, {
            secret: envConfig.ACCESS_TOKEN_SECRET
        })
    }

    verifyRefreshToken(token: string): Promise<RefreshTokenPayLoad> // Đảm bảo rằng token trả về có kiểu RefreshTokenPayload
    {
        return this.jwtService.verifyAsync(token, {
            secret: envConfig.REFRESH_TOKEN_SECRET
        })
    }
}
