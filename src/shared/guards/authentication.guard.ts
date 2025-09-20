import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException } from '@nestjs/common';
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
    
    const authTypeValue = this.getAuthTypeValue(context)
    const guards = authTypeValue.authTypes.map((authType) => this.authTypeGuardMap[authType]);
  

    if(authTypeValue.options.condition === ConditionGuard.Or) {
        return this.handleOrCondition(guards, context)
     } else {
        return this.handleAndCondition(guards, context)
    }
  }

  private getAuthTypeValue(context: ExecutionContext) : AuthTypeDecoratorPayload {
    const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPES_KEY, [
        context.getHandler(),
        context.getClass(),
    ]) ?? { authTypes: [AuthType.Bearer], options: { condition: ConditionGuard.And } };
    return authTypeValue
  }

  private async handleOrCondition(guards: CanActivate[], context: ExecutionContext) {
    let lastError : any = null;
    //Duyet cac guards, neu 1 guards pass thi true
    for(const guard of guards) {
      try{
        if(await guard.canActivate(context)) {
          return true
        }
      } catch(error) {
        lastError = error
      }
    }

    if(lastError instanceof HttpException) {
      throw lastError
    }
    throw new UnauthorizedException()
  }


  private async handleAndCondition(guards: CanActivate[], context: ExecutionContext) {
    //Duyet neu moi guard pass thi return true
    for(const guard of guards) {
      try{
        if(!await guard.canActivate(context)) {
          throw new UnauthorizedException()
        }
      } catch(error) {
        if(error instanceof HttpException) {
          throw error
        }
        throw new UnauthorizedException()
      }
    }
    return true;
  }
}