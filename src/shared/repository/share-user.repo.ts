import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { UserType } from "../models/share-user.model";
import { RoleType } from "../models/shared-role.model";
import { PermissionType } from "../models/shared-permission.model";


type WhereUniqueUserType = {id: number, [key: string] : any} | {email: string, [key: string] : any} 
// key: string là các trường khác của user

type UserIncludePermissionsType = UserType & {role: RoleType & {permissions: PermissionType[]}} 

@Injectable()
export class ShareUserRepository {
    constructor(private readonly prismaService: PrismaService) {}
    
    findUnique(where: WhereUniqueUserType) : Promise<UserType | null> {
        return this.prismaService.user.findUnique({
            where: where
        })
    }


    findUniqueIncludeRolePermissions(where: WhereUniqueUserType) : Promise<UserIncludePermissionsType | null> {
        return this.prismaService.user.findUnique({
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

    update(where: WhereUniqueUserType , data: Partial<UserType>) : Promise<UserType | null> { 
        // Partial là biến tất cả các field thành optional
        return this.prismaService.user.update({
            where,
            data
        })

    }
    
}