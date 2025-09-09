import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { DeviceType, RegisterBodyType, RoleType, VerificationCodeType } from "./auth.model";
import { UserType } from "src/shared/models/share-user.model";
import { TypeOfVerificationCodeType } from "src/shared/constants/auth.constant";
import { Role } from "@prisma/client";

@Injectable()
export class AuthRepository {
    constructor(private readonly PrismaService: PrismaService) {}

    async createUser(user: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>) : 
    Promise<Omit<UserType, 'password' | 'totpSecret'>> { // Promise là kiểu trả về với password và toptSecret bị loại bỏ
        return this.PrismaService.user.create({
                data: user,
                omit: {
                    password: true,
                    totpSecret: true,
                }
            })
    }


    async createVerificationCode(payload: Pick<VerificationCodeType, 'email' | 'code' | 'type' | 'expiresAt'>) : Promise<VerificationCodeType> {
        return this.PrismaService.verificationCode.upsert({
            where: {
                email: payload.email,
            }, 
            create: payload,
            update: {
                code: payload.code,
                expiresAt: payload.expiresAt,
            }
        })
    }


    async findUniqueVerificationCode(
        uniqueValue: 
        {email: string} 
        | {id: number} 
        | 
        {
            email: string,
            code: string,
            type: TypeOfVerificationCodeType
        }
    ) : Promise<VerificationCodeType | null> {
        return this.PrismaService.verificationCode.findUnique({
            where: uniqueValue

        })
    }


    createRefreshToken(data: {token: string; userId: number; expiresAt: Date; deviceId: number}) {
        return this.PrismaService.refreshToken.create({
            data
        })
    }

    createDevice(data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>) { 
        // Partial là cho phép các trường lastActive và isActive không bắt buộc
        return this.PrismaService.device.create({
            data
        })
    }
    

    async findUniqueUserIncludeRole(uniqueObject: {email: string} | {id: number}) : Promise<UserType & {role: RoleType} | null> {
        return this.PrismaService.user.findUnique({
            where: uniqueObject,
            include: {
                role: true
            }
        })
    }
}