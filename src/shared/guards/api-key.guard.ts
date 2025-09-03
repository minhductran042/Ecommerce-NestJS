import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { REQUEST_USER_KEY } from '../constants/auth.constant';
import envConfig from '../config';

const SECRET_KEY = envConfig.SECRET_API_KEY;

@Injectable()
export class ApiKeyGuard implements CanActivate {
     canActivate(
        context: ExecutionContext,
    ): boolean  {   
    const request = context.switchToHttp().getRequest();
    const xApiKey = request.headers['x-api-key'];
    if(xApiKey !== SECRET_KEY) {
        throw new UnauthorizedException('Invalid API key');
    }
    return true; // API key is valid
  }
}