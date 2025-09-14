import { ConflictException, HttpException, Injectable, UnauthorizedException, UnprocessableEntityException} from '@nestjs/common';
import { HashingService } from '../../shared/services/hashing.service';
import { TokenService } from 'src/shared/services/token.service';
import { generateOTP, isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { RoleService } from './role.service';
import { DisableTwoFactorBodyType, ForgotPasswordType, LoginBodyType, logoutBodyType, RefreshTokenBodyType, RegisterBodyType, SendOTPBodyType } from './auth.model';
import { AuthRepository } from './auth.repo';
import { ShareUserRepository } from 'src/shared/repository/share-user.repo';
import envConfig from 'src/shared/config';
import { addMilliseconds } from 'date-fns';
import ms from 'ms';
import path from 'path';
import { EmailService } from 'src/shared/services/email.service';
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type';
import { EmailAlreadyExistesException, EmailNotFoundException, FailToSendOTPException, InvalidOTPException, InvalidTOTPAndCodeException, InvalidTOTPException, OTPExpireException, RefreshTokenAlreadyUseException, TOTPAlreadyEnableException, TOTPNotEnableException, UserNotFoundException } from './error.model';
import { TypeOfVerificationCode, TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant';
import { TwoFactorAuthService } from 'src/shared/services/2fa.service';
import { email } from 'zod';

@Injectable()
export class AuthService {
    constructor(
        private readonly hashingService: HashingService,
        private readonly tokenService: TokenService,
        private readonly roleService: RoleService,
        private readonly authRepository: AuthRepository,
        private readonly shareUserRepository: ShareUserRepository,
        private readonly emailService: EmailService,
        private readonly twoFactorAuthenticationService: TwoFactorAuthService
    ) {}


    
    async validateVerificationCode({
        email,
        code,
        type
    } : {
        email:string, 
        code: string,
        type: TypeOfVerificationCodeType
    }) {
        const verificationCode = await this.authRepository.findUniqueVerificationCode(
            {
                email_code_type: {
                    email,
                    code, 
                    type
                }
            }
        )

        if(!verificationCode) {
            throw InvalidOTPException
        }

        if(verificationCode.expiresAt < new Date) {
            throw OTPExpireException
        }
        return verificationCode
    }



    async register(body: RegisterBodyType) {
        try {
            
            await this.validateVerificationCode({
                email: body.email,
                code: body.code,
                type: TypeOfVerificationCode.REGISTER
            })

            const clientRoleId = await this.roleService.getClientRoleId();
            const hashedPassword = await this.hashingService.hash(body.password);
            
            const user = Promise.all(
            [
                this.authRepository.createUser({
                email: body.email,
                name: body.name,
                phoneNumber: body.phoneNumber,
                password: hashedPassword,
                roleId: clientRoleId,
            }), 
                this.authRepository.deleteVerificationCode(
                    {
                        email_code_type : {
                            email: body.email,
                            code: body.code,
                            type: TypeOfVerificationCode.FORGOT_PASSWORD
                        }
                    }
                )
        
            ])



        } catch (error) {
           if(isUniqueConstraintPrismaError(error)) {
                throw EmailAlreadyExistesException
            }
            throw error
        }
    }

    async sendOTP(body: SendOTPBodyType) {

        const user = await this.authRepository.findUniqueUserIncludeRole({ email: body.email });
        if(body.type === TypeOfVerificationCode.REGISTER && user) {
            throw EmailAlreadyExistesException
        }

        if(body.type === TypeOfVerificationCode.FORGOT_PASSWORD && !user) {
            throw EmailNotFoundException
        }

        //2. Tạo mã OTP và lưu vào cơ sở dữ liệu
        const code = generateOTP();
        await this.authRepository.createVerificationCode({
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
            throw FailToSendOTPException
        }


        return {
            message: "Gửi mã OTP thành công"
        };
    }

    async login(body: LoginBodyType & {userAgent: string, ip: string}) {
        //1. Lấy thông tin user, check tồn tại, xem mk đúng k
        const user = await this.authRepository.findUniqueUserIncludeRole({
            email: body.email
        })
        if(!user) {
            throw UserNotFoundException
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

        //2. Nếu đã bật mã 2fa, kiểm tra mã 2fa totp code hoặc otp code(gmail)
        if(user.totpSecret) {
            //Nếu không có mã TOTP code hoặc mã otp code
            if(!body.code && !body.totpCode) {
                throw InvalidTOTPAndCodeException
            }

            if(body.totpCode) {
                const isValid = this.twoFactorAuthenticationService.verifyTOTP({
                    email: user.email,
                    secret: user.totpSecret,
                    token: body.totpCode
                })

                if(!isValid) {
                    throw InvalidTOTPException
                }
            } else if (body.code) {
                const isValid = this.validateVerificationCode({
                    email: user.email,
                    code: body.code,
                    type: TypeOfVerificationCode.LOGIN
                })

                if(!isValid) {
                    throw InvalidOTPException
                }
            } 

        }

        // 3.Tạo record device
        const device = await this.authRepository.createDevice({
            userId: user.id,
            userAgent: body.userAgent,
            ip: body.ip
        })


        //4. Trả về RefreshToken về cho người dùng
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
                throw RefreshTokenAlreadyUseException
            }

            //3. Cập nhật device 
            const {deviceId , user: {roleId, role: {name: roleName}}} = refreshTokenInDb;
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


    async logout({ refreshToken }: logoutBodyType) {
        try {
            //1. Kiểm tra xem refresh token có hợp lệ không
            const userId = await this.tokenService.verifyRefreshToken(refreshToken);

            //2. Xoa token 
            const deleteRefreshToken = await this.authRepository.deleteRefreshToken({
                token: refreshToken
            })

        
            //3. Cap nhat device la da logout
            await this.authRepository.updateDevice(deleteRefreshToken.deviceId, {
                isActive: false,
            })

            return {
                message: 'Logout successfully'
            }
        } catch (error) {
            // Truong hợp đã sử dụng refresh token hoặc token không hợp lệ
            if(isNotFoundPrismaError(error)) {
                throw RefreshTokenAlreadyUseException
            }
            throw new UnauthorizedException
        }
    }
    
    async forgotPassword(body: ForgotPasswordType) {
        const {email, code , newPassword } = body

        //1. Kiểm tra email có trong database không
        const user = await this.shareUserRepository.findUniqueObject({
            email: email
        })
        if(!user) {
            throw EmailNotFoundException
        }

        //2. Kiểm tra mã OTP có hợp lệ không
        await this.validateVerificationCode({
            email: body.email,
            code: body.code,
            type: TypeOfVerificationCode.FORGOT_PASSWORD
        })


        //3. Cập nhật mật khẩu người dùng và xóa đi verification code trong database
        const hashedPassword = await this.hashingService.hash(newPassword)
        await Promise.all(
            [
                this.authRepository.updateUser(
                    { id: user.id} , 
                    { password : hashedPassword}
                )
                ,
                this.authRepository.deleteVerificationCode(
                    {
                        email_code_type: {
                            email: body.email,
                            code: body.code,
                            type: TypeOfVerificationCode.FORGOT_PASSWORD
                        }
                    }
                )
            ]
        )

        return {
            message: 'Đổi mật khẩu thành công'
        }

    }

    
    async setupTwoFactorAuthentication(userId : number) {
        //1. Kiểm tra user có tồn tại hay không, có bật xác thực 2FA không
        const user = await this.shareUserRepository.findUniqueObject(
            {
                id: userId
            }
        )

        if(!user) {
            throw UserNotFoundException
        }

        if(user.totpSecret) {
            throw TOTPAlreadyEnableException
        }

        //2. Tạo ra secret và uri
        const {secret, uri} = this.twoFactorAuthenticationService.generateTOTPSecret(user.email);

        //3. Cập nhật secret vào user trong db
        await this.authRepository.updateUser({
            id: userId
        }, {
            totpSecret: secret
        })

        //4. Trả về secret và url cho client
        return {
            secret, 
            uri
        }
    }

    async disableTwoFactorAuthentication(data : DisableTwoFactorBodyType & {userId: number}) {
        const {userId, code , totpCode } = data
        //1. Kiểm tra user có tồn tại hay không, có bật xác thực 2FA không
        const user = await this.shareUserRepository.findUniqueObject(
            {
                id: userId
            }
        )
        if(!user) {
            throw UserNotFoundException
        }
        if(!user.totpSecret) {
            throw TOTPNotEnableException
        }

        //2. Kiểm tra mã code hoặc totp có hợp lệ không
        if(totpCode) {
            const isValid = this.twoFactorAuthenticationService.verifyTOTP({
                email: user.email,
                secret: user.totpSecret,
                token: totpCode
            })

            if(!isValid) {
                throw InvalidTOTPException
            }

        } else if(code) {
            const isValid = await this.validateVerificationCode({
                email: user.email,
                code: code,
                type: TypeOfVerificationCode.DISABLE_2FA
            })

            if(!isValid) {
                throw InvalidOTPException
            }
        }

        //3. Xóa secret trong db
        await this.authRepository.updateUser({
            id: userId
        }, {
            totpSecret: null
        })

        return {
            message: 'Disable 2FA successfully'
        }

    }
}