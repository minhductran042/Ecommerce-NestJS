import { ConflictException, HttpException, Injectable, UnauthorizedException, UnprocessableEntityException} from '@nestjs/common';
import { HashingService } from '../../shared/services/hashing.service';
import { TokenService } from 'src/shared/services/token.service';
import { generateOTP, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { RoleService } from './role.service';
import { LoginBodyType, RefreshTokenBodyType, RegisterBodyType, SendOTPBodyType } from './auth.model';
import { AuthRepository } from './auth.repo';
import { ShareUserRepository } from 'src/shared/repository/share-user.repo';
import envConfig from 'src/shared/config';
import { addMilliseconds } from 'date-fns';
import ms from 'ms';
import path from 'path';
import { EmailService } from 'src/shared/services/email.service';
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly hashingService: HashingService,
        private readonly tokenService: TokenService,
        private readonly roleService: RoleService,
        private readonly authRepository: AuthRepository,
        private readonly shareUserRepository: ShareUserRepository,
        private readonly emailService: EmailService
    ) {}

    async register(body: RegisterBodyType) {
        try {
            const verificationCode = await this.authRepository.findUniqueVerificationCode({
                email: body.email,
                code: body.code,
                type: 'REGISTER'
            })
            const clientRoleId = await this.roleService.getClientRoleId();
            const hashedPassword = await this.hashingService.hash(body.password);
            
            if(!verificationCode) {
                throw new UnprocessableEntityException({
                    message: 'Mã OTP không hợp lệ',
                    path: 'code',
                });
            }

            if(verificationCode.expiresAt < new Date()) {
                throw new UnprocessableEntityException({
                    message: 'Mã OTP đã hết hạn',
                    path: 'code',
                });
            }


            return await this.authRepository.createUser({
                email: body.email,
                name: body.name,
                phoneNumber: body.phoneNumber,
                password: hashedPassword,
                roleId: clientRoleId,
            })
        } catch (error) {
           if(isUniqueConstraintPrismaError(error)) {
                throw new UnprocessableEntityException({
                    message: 'Email đã tồn tại',
                    path: 'email',
                });
            }
            throw error
        }
    }

    async sendOTP(body: SendOTPBodyType) {
        //1. Kiểm tra email đã tồn tại trong hệ thống chưa
        const user = await this.authRepository.findUniqueUserIncludeRole({ email: body.email });
        if(user) {
            throw new UnprocessableEntityException({
                    message: 'Email đã tồn tại',
                    path: 'email',
            });
        }

        //2. Tạo mã OTP và lưu vào cơ sở dữ liệu
        const code = generateOTP();
        const verificationCode = await this.authRepository.createVerificationCode({
            email: body.email,
            code: code,
            type: body.type,
            expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN)) // Thời gian hiện tại + thời gian hết hạn
        });

        //3. Gửi mã OTP đến email người dùng
        const {error} = await this.emailService.sendOTP({
            email: body.email,
            code: code
        })
        if(error) {
            throw new UnprocessableEntityException({
                message: 'Có lỗi xảy ra khi gửi OTP',
                path: 'email',
            })
        }


        return verificationCode;
    }

    async login(body: LoginBodyType & {userAgent: string, ip: string}) {
        const user = await this.authRepository.findUniqueUserIncludeRole({
            email: body.email
        })
        if(!user) {
            throw new UnprocessableEntityException({
                message: 'User not found',
                path: 'email',
            })
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

        // Tạo record device
        const device = await this.authRepository.createDevice({
            userId: user.id,
            userAgent: body.userAgent,
            ip: body.ip
        })


        const tokens = await this.generateTokens({
            userId: user.id,
            deviceId: device.id,
            roleId: user.roleId,
            roleName: user.role.name
        });

        return tokens;
    }



    async generateTokens({userId, deviceId, roleId, roleName}: AccessTokenPayloadCreate ) {
        const [acccessToken, refreshToken] = await Promise.all([
            this.tokenService.signAccessToken({
                userId,
                deviceId,
                roleId,
                roleName
            }),
            this.tokenService.signRefreshToken({
                userId
            })
        ]);

        const decodeRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
        await this.authRepository.createRefreshToken({
                token: refreshToken,
                userId,
                deviceId,
                expiresAt: new Date(decodeRefreshToken.exp * 1000) // Chuyển đổi giây sang mili giây,
                
        });
        return {
            accessToken: acccessToken,
            refreshToken: refreshToken
        }
    }


    async refreshToken({
        refreshToken,
        userAgent,
        ip
    }: RefreshTokenBodyType & { userAgent: string; ip: string  })  {
        try {
            //1. Kiểm tra xem refresh token có hợp lệ không
            const { userId } = await this.tokenService.verifyRefreshToken(refreshToken);

            //2. Kiểm tra xem refresh token có tồn tại trong cơ sở dữ liệu không
            const refreshTokenInDb = await this.authRepository.findUniqueRefreshTokenIncludeUserRole({
                token: refreshToken
            })

            if(!refreshTokenInDb) {
                // Truong hợp đã sử dụng refresh token hoặc token không hợp lệ
                throw new UnauthorizedException('Refresh Token has been used')
            }

            //3. Cập nhật device 
            const {deviceId , user: {roleId, name: roleName}} = refreshTokenInDb;
            const $updateDevice =   this.authRepository.updateDevice( deviceId , { 
                userAgent, 
                ip 
            }) 


            //4. Xoa token cũ

            const $deleteRefreshToken = this.authRepository.deleteRefreshToken({
                token: refreshToken
            })


            //5. Tạo mới access token và refresh token 
            const $tokens = this.generateTokens({ userId, deviceId , roleId, roleName }) 

            const [, , tokens] = await Promise.all([$updateDevice, $deleteRefreshToken, $tokens]) 
            return tokens;

        } catch (error) {
            if(error instanceof HttpException) {
                throw error
            }
            throw new UnauthorizedException()
        }
    }


    // async logout(refreshToken: string) {
    //     try {
    //         //1. Kiểm tra xem refresh token có hợp lệ không
    //         const userId = await this.tokenService.verifyRefreshToken(refreshToken);

    //         //2. Xoa token 
    //         await this.prismaService.refreshToken.delete({
    //             where: {
    //                 token: refreshToken
    //             }
    //         });

    //         return {
    //             message: 'Logout successfully'
    //         }
    //     } catch (error) {
    //         // Truong hợp đã sử dụng refresh token hoặc token không hợp lệ
    //         if(isNotFoundPrismaError(error)) {
    //             throw new UnauthorizedException('Refresh token is invalid or has been used')
    //         }
    //         throw new UnauthorizedException
    //     }
    // }
    
}
