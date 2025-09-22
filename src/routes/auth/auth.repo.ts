import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { DeviceType, RefreshTokenType, RegisterBodyType,VerificationCodeType } from "./auth.model";
import { UserType } from "src/shared/models/share-user.model";
import { TypeOfVerificationCodeType } from "src/shared/constants/auth.constant";
import { Role, User } from "@prisma/client";
import { WhereUniqueUserType } from "src/shared/repository/share-user.repo";
import { RoleType } from "src/shared/models/shared-role.model";

@Injectable()
export class AuthRepository {
    constructor(private readonly prismaService: PrismaService) {}



    createUser(user: Pick<UserType, 'email' | 'name'| 'phoneNumber' | 'roleId' | 'password'>) : 
    Promise<Omit<UserType, 'password' | 'totpSecret'>> { // Promise là kiểu trả về với password và toptSecret bị loại bỏ
        return this.prismaService.user.create({
                data: user,
                omit: {
                    password: true,
                    totpSecret: true,
                }
            })
    }

    createUserIncludeRole(user: Pick<UserType, 'email' | 'name'| 'phoneNumber' | 'roleId' | 'password' | 'avatar'>) : 
    Promise<UserType & {role: RoleType}> { // Promise là kiểu trả về với password và toptSecret bị loại bỏ
        return this.prismaService.user.create({
                data: user,
                include: {
                    role: true
                }
            })
    }


    createVerificationCode(payload: Pick<VerificationCodeType, 'email' | 'code' | 'type' | 'expiresAt'>) : Promise<VerificationCodeType> {
        return this.prismaService.verificationCode.upsert({
            where: {
                email_type: {
                    email: payload.email,
                    type: payload.type
                }
            }, 
            create: payload,
            update: {
                code: payload.code,
                expiresAt: payload.expiresAt,
            }
        })
    }


    findUniqueVerificationCode(
        uniqueValue: 
        | {id: number} 
        | 
        {
            email_type: {
                email: string,
                type: TypeOfVerificationCodeType
            }
        }
    ) : Promise<VerificationCodeType | null> {
        return this.prismaService.verificationCode.findUnique({
            where: uniqueValue

        })
    }


    createRefreshToken(data: {token: string; userId: number; expiresAt: Date; deviceId: number}) {
        return this.prismaService.refreshToken.create({
            data
        })
    }

    createDevice(data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>) { 
        // Partial là cho phép các trường lastActive và isActive không bắt buộc
        return this.prismaService.device.create({
            data
        })
    }
    

    async findUniqueUserIncludeRole(where: WhereUniqueUserType) : 
    Promise<UserType & {role: RoleType} | null> {
        return this.prismaService.user.findUnique({
            where: where,
            include: {
                role: true
            }
        })
    }

    async findUniqueRefreshTokenIncludeUserRole(uniqueObject: {token: string}) : 
    Promise<RefreshTokenType & {user: UserType & {role: RoleType} } | null > 
    
    {
        return this.prismaService.refreshToken.findUnique({
            where: uniqueObject,
            include: {
                user: {
                    include: {
                        role: true
                    }
                }
            }
        })
    }


    async updateDevice(deviceId: number , data: Partial<DeviceType>) : Promise<DeviceType> {
        return await this.prismaService.device.update({
            where: {
                id: deviceId
            }, 
            data
        })
    }

    deleteRefreshToken(uniqueObject: {token : string}) : Promise<RefreshTokenType> {
        return this.prismaService.refreshToken.delete({
            where: uniqueObject
        })
    }
 

    deleteVerificationCode(uniqueObject: 
        {id: number} 
        | 
        {
            email_type: {
                email: string,
                type: TypeOfVerificationCodeType
            }
        }
    ) : Promise<VerificationCodeType> {
        return this.prismaService.verificationCode.delete({
            where: uniqueObject
        })

    }
    
}