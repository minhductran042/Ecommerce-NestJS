import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthType, ConditionGuard, REQUEST_USER_KEY } from '../constants/auth.constant';
import envConfig from '../config';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPES_KEY, AuthTypeDecoratorPayload } from '../decorator/auth.decorator';
import { AccessTokenGuard } from './access-token.guard';
import { ApiKeyGuard } from './api-key.guard';

const SECRET_KEY = envConfig.SECRET_API_KEY;

@Injectable()
export class AuthenticationGuard implements CanActivate {
    private authTypeGuardMap: Record<string, CanActivate>;

    constructor(
        private readonly reflector: Reflector,
        private readonly accessTokenGuard: AccessTokenGuard,
        private readonly apiKeyGuard: ApiKeyGuard
    ) {
        this.authTypeGuardMap = {
            [AuthType.Bearer]: this.accessTokenGuard,
            [AuthType.ApiKey]: this.apiKeyGuard,
            [AuthType.None]: { canActivate: () => true },
        };
    }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {   
    const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authTypes: [AuthType.None], options: { condition: ConditionGuard.And } };
         const guards = authTypeValue.authTypes.map((authType) => this.authTypeGuardMap[authType]);
     let error = new UnauthorizedException();
     if(authTypeValue.options.condition === ConditionGuard.Or) {
        for(const instance of guards) {
         try {
           const canActivate = await instance.canActivate(context);
           if(canActivate) {
             return true; // If any guard allows access, return true
           }
         } catch (err) {
           error = err;
         }
       }
       throw error;
     } else {
       for(const instance of guards) {
         const canActivate = await instance.canActivate(context);
         if(!canActivate) {
           throw new UnauthorizedException();
         }
       }
       return true; // API key is valid
     }

  }
}