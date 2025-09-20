import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { REQUEST_USER_KEY } from '../constants/auth.constant';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { request } from 'http';
import { access } from 'fs';
import { AccessTokenPayload } from '../types/jwt.type';
import { PrismaService } from '../services/prisma.service';
import { permission } from 'process';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor (
        private readonly tokenService: TokenService,
        private readonly prismaService: PrismaService
    ) {}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean>  {
    
    const request = context.switchToHttp().getRequest();

    //Extract va validate token
    const decodedAccessToken = await this.extractAndValidateAccessToken(request)
    
    //Check user permission
    await this.validatePermission(decodedAccessToken, request)
    return true;
  }

    private extractAccessTokenFromHeader(request : any) : string {
        const accessToken = request.headers['authorization']?.split(' ')[1]
        if(!accessToken) {  
            throw new UnauthorizedException('ERROR.MISSING_ACCESS_TOKEN')
        }
        return accessToken
    }

    private async extractAndValidateAccessToken(request: any) : Promise<AccessTokenPayload> {
        const accessToken = this.extractAccessTokenFromHeader(request)
        try{
            const decodedAccessToken = await this.tokenService.verifyAccessToken(accessToken)
            request[REQUEST_USER_KEY] = decodedAccessToken
            return decodedAccessToken
        } catch(error) {
            throw new UnauthorizedException('ERROR.ACCESS_TOKEN_INVALID')
        }
    }

    private async validatePermission(decodedAccessToken: AccessTokenPayload, request: any) : Promise<void> {
        const roleId = decodedAccessToken.roleId
        const path = request.route.path
        const method = request.method
        const role = await this.prismaService.role.findUniqueOrThrow({
            where: {
                id: roleId,
                deletedAt: null
            },
            include: {
                permissions: {
                    where: {
                        deletedAt: null,
                        path,
                        method
                    }
                }
            }
        }).catch(() => {
            throw new ForbiddenException()
        })
        
        // console.log(role)
        // some: Kiem tra it nhat 1 phan tu thoa man dieu kien
        const isAccess = role.permissions.length > 0
        if(!isAccess) {
            throw new ForbiddenException()
        } 
    }
}

