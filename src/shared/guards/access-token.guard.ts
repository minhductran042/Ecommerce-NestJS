import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { REQUEST_USER_KEY } from '../constants/auth.constant';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor (private readonly tokenService: TokenService) {}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean>  {
    
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers['authorization']?.split(' ')[1]
    if(!accessToken) {
        throw new UnauthorizedException('Access token is required');
    }
    try {
        const decodedAccessToken = await this.tokenService.verifyAccessToken(accessToken)
        request[REQUEST_USER_KEY] = decodedAccessToken
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new UnauthorizedException('Access token has expired');
        } else if (error instanceof JsonWebTokenError) {
            throw new UnauthorizedException('Invalid access token');
        } else {
            throw new UnauthorizedException('Token verification failed');
        }
    }
    return true; // Access token is valid
  }
}