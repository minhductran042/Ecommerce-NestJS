import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { CreateRoleBodyType, GetRoleQueryType, GetRolesResType, RoleType, UpdateRoleBodyType } from "./role.model";
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
                        permissions: true
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

    findById(roleId: number) : Promise<RoleType | null> {
        return this.prismaService.role.findFirst({
            where: {
                id: roleId
            },
            include: {
                permissions: true
            }
        })
    }

    update({
        roleId,
        data,
        updatedById
    }: {
        roleId: number,
        data: UpdateRoleBodyType,
        updatedById: number
    }) {
        return this.prismaService.role.update({
            where: {
                id: roleId
            },
            data: {
                ...data,
                updatedById,
                permissions: {
                    set: data.permissionIds.map(id => ({id})) // set nhan 1 mang object 
                    //vd [{ id: 1 }, { id: 2 }, { id: 3 }] => sai khi truyen [1,2,3]
                }
            },
            include: {
                permissions: true
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