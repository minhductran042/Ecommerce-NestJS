import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { HashingService } from '../../shared/services/hashing.service';
import { Prisma } from '@prisma/client';
import { TokenService } from 'src/shared/services/token.service';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { RoleService } from './role.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly hashingService: HashingService,
        private readonly tokenService: TokenService,
        private readonly roleService: RoleService
    ) {}

    async register(body: any) {
        try {
            const clientRoleId = await this.roleService.getClientRoleId();
            const hashedPassword = await this.hashingService.hash(body.password);
            const user = await this.prismaService.user.create({
                data: {
                    email: body.email,
                    password: hashedPassword,
                    name: body.name,
                    phoneNumber: body.phoneNumber,
                    roleId: clientRoleId
                },
                omit: {
                    totpSecret: true,
                }
            })
            return user
        } catch (error) {
           if(isUniqueConstraintPrismaError(error)) {
                throw new ConflictException('Email already exists');
            }
            throw error
        }
    }

    async login(body: any) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: body.email,
            }
        })
        if(!user) {
            throw new UnauthorizedException('Account does not exist')
        }

        const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
        if(!isPasswordMatch) {
            throw new UnprocessableEntityException([
                {
                    field: 'password',
                    error: 'Incorrect password'
                }
            ])
        }
        const tokens = await this.generateTokens({ userId: user.id });
        return tokens;
    }

    async generateTokens(payload: { userId: number }) {
        const [acccessToken, refreshToken] = await Promise.all([
            this.tokenService.signAccessToken(payload),
            this.tokenService.signRefreshToken(payload)
        ]);

        const decodeRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
        await this.prismaService.refreshToken.create({
            data: {
                token: refreshToken,
                userId: payload.userId,
                expiresAt: new Date(decodeRefreshToken.exp * 1000) // Chuyển đổi giây sang mili giây
            }
        });
        return {
            accessToken: acccessToken,
            refreshToken: refreshToken
        }
    }


    async refreshToken(refreshToken: string) {
        try {
            //1. Kiểm tra xem refresh token có hợp lệ không
            const decoded = await this.tokenService.verifyRefreshToken(refreshToken);

            //2. Kiểm tra xem refresh token có tồn tại trong cơ sở dữ liệu không
            await this.prismaService.refreshToken.findUniqueOrThrow({
                where: {
                    token: refreshToken
                }
            })
            //3. Xoa token cũ
            await this.prismaService.refreshToken.delete({
                where: {
                    token: refreshToken
                }
            });

            //4. Tạo mới access token và refresh token
            return await this.generateTokens({ userId: decoded.userId });
        } catch (error) {
            // Truong hợp đã sử dụng refresh token hoặc token không hợp lệ
            if(isNotFoundPrismaError(error)) {
                throw new UnauthorizedException('Refresh token is invalid or has been used')
            }
            throw new UnauthorizedException
        }
    }


    async logout(refreshToken: string) {
        try {
            //1. Kiểm tra xem refresh token có hợp lệ không
            const userId = await this.tokenService.verifyRefreshToken(refreshToken);

            //2. Xoa token 
            await this.prismaService.refreshToken.delete({
                where: {
                    token: refreshToken
                }
            });

            return {
                message: 'Logout successfully'
            }
        } catch (error) {
            // Truong hợp đã sử dụng refresh token hoặc token không hợp lệ
            if(isNotFoundPrismaError(error)) {
                throw new UnauthorizedException('Refresh token is invalid or has been used')
            }
            throw new UnauthorizedException
        }
    }
    
}
