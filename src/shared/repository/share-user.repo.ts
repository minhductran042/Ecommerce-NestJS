import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { UserType } from "../models/share-user.model";
import { RoleType } from "../models/shared-role.model";
import { PermissionType } from "../models/shared-permission.model";


export type WhereUniqueUserType = {id: number} | {email: string} 
// key: string là các trường khác của user

type UserIncludePermissionsType = UserType & {role: RoleType & {permissions: PermissionType[]}} 

@Injectable()
export class ShareUserRepository {
    constructor(private readonly prismaService: PrismaService) {}
    
    findUnique(where: WhereUniqueUserType) : Promise<UserType | null> {
        return this.prismaService.user.findFirst({
            where: {
                ...where,
                deletedAt: null
            }
        })
    }


    findUniqueIncludeRolePermissions(where: WhereUniqueUserType) : Promise<UserIncludePermissionsType | null> {
        return this.prismaService.user.findFirst({
            where,
            include: {
                role: {
                    include: {
                        permissions: {
                            where: {
                                deletedAt: null
                            }
                        }
                    }
                }
            } 
        })
    }

    
    update(where: {id: number} , data: Partial<UserType>) : Promise<UserType | null> { 
        // Partial là biến tất cả các field thành optional
        return this.prismaService.user.update({
            where: {
                ...where,
                deletedAt: null
            },
            data
        })

    }
    
}