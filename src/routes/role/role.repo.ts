import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { CreateRoleBodyType, GetRoleQueryType, GetRolesResType, RoleType, RoleWithPermissionsType, UpdateRoleBodyType } from "./role.model";
import { boolean, set } from "zod";
import { permission } from "process";

@Injectable()
export class RoleRepository {
    constructor(private readonly prismaService: PrismaService) {}
    
    create({
        data,
        createdById
    }: {
        data: CreateRoleBodyType,
        createdById: number
    }): Promise<RoleType> {
        return this.prismaService.role.create({
            data: {
                ...data,         // Spread các trường trong data
                createdById      // Thêm createdById vào data
            }
        });
    }

    async list(pagination: GetRoleQueryType) : Promise<GetRolesResType> {
        const skip = (pagination.page - 1) * pagination.limit
        const take = pagination.limit
        const [totalItems, data] = await Promise.all([
                this.prismaService.role.count({
                    where: {
                        deletedAt: null
                    }
                }),
                this.prismaService.role.findMany({
                    where: {
                        deletedAt: null
                    },
                    skip,
                    take,
                    include: {
                        permissions: {
                            where: {
                                deletedAt: null
                            }
                        }
                    }
                })
        ])

        const totalPages = Math.ceil(totalItems / pagination.limit)

        return {
            roles: data,
            totalItems, 
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(totalItems / pagination.limit)
        }
    }

    findById(roleId: number) : Promise<RoleWithPermissionsType | null> {
        return this.prismaService.role.findFirst({
            where: {
                id: roleId
            },
            include: {
                permissions: {
                    where: {
                        deletedAt: null
                    }
                }
            }
        })
    }

    async update({
        roleId,
        data,
        updatedById
    }: {
        roleId: number,
        data: UpdateRoleBodyType,
        updatedById: number
    }) : Promise<RoleType> {

        //Xem permission nào đã bị xóa mềm thì check
        if(data.permissionIds.length > 0) {
            const permissions = await this.prismaService.permission.findMany({
                where: {
                    id: {
                        in: data.permissionIds
                    }
                }
            })

            const deletePermissions = permissions.filter(permission => permission.deletedAt)

            if(deletePermissions.length > 0) {
                const deletedIds = deletePermissions.map(permission => permission.id).join(', ')
                throw new Error(`Permission with ids ${deletedIds} has been deleted`)

            }
        }

        return this.prismaService.role.update({
            where: {
                id: roleId
            },
            data: {
                name: data.name,
                description: data.description,
                isActive: data.isActive,
                updatedById,
                permissions: {
                    set: data.permissionIds.map(id => ({id})) // set nhan 1 mang object 
                    //vd [{ id: 1 }, { id: 2 }, { id: 3 }] => sai khi truyen [1,2,3]
                }
            },
            include: {
                permissions: {
                    where: {
                        deletedAt: null
                    }
                }
            }
        })
    }

    delete(roleId: number, isHard? : boolean) : Promise<RoleType> {
        return isHard ? 
        this.prismaService.role.delete({
            where: {
                id: roleId
            }
        })
        : this.prismaService.role.update({
            where: {
                id: roleId
            },           
            data: {
                deletedAt: new Date()
            }
        })
    }
    
}