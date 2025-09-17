import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { CreatePermissionBodyType, GetPermissionDetailType, GetPermissionQueryType, GetPermissionsResType, PermissionType, UpdatePermissionBodyType } from "./permission.model";
import { NumberSchema } from "node_modules/zod/v4/core/json-schema.cjs";

@Injectable()
export class PermissionRepository {
    // Repository methods here
    constructor(private readonly prismaService: PrismaService) {}
    async list(pagination: GetPermissionQueryType) : Promise<GetPermissionsResType> {
        const skip = (pagination.page - 1) * pagination.limit
        const take = pagination.limit

        const [totalItems, data] = await Promise.all([
            this.prismaService.permission.count({
                where: {
                    deletedAt: null
                }
            }),

            this.prismaService.permission.findMany({
                where: {
                    deletedAt: null
                },
                skip,
                take
            })
        ])
        
        return {
            data,
            totalItems, 
            page: pagination.page,
            pageSize: pagination.limit,
            totalPages: Math.ceil(totalItems / pagination.limit)
        }
    }

    findById(permissionId: number) : Promise<PermissionType | null> {
        const permission = this.prismaService.permission.findFirst({
            where: {
                id: permissionId,
                deletedAt: null
            }
        })
        return permission
    }

    create({
        data, 
        createdById
    }: {
        data: CreatePermissionBodyType,
        createdById: number
    }) : Promise<PermissionType> {
        const newPermission = this.prismaService.permission.create({
            data: {
                ...data,
                createdById
            }
        })
        return newPermission
    }

    update({
        permissionId,
        data,
        updatedById
    }: {
        permissionId: number,
        data: UpdatePermissionBodyType,
        updatedById: number
    }) : Promise<PermissionType> {
        const updatedPermission = this.prismaService.permission.update({
            where: {
                id: permissionId,
            }, 
            data: {
                ...data,
                updatedById
            }
        })
        return updatedPermission
    }

    delete(permissionId: number, isHard? : boolean) : Promise<PermissionType> {
        return isHard ? 
        this.prismaService.permission.delete({
            where: {
                id: permissionId
            }
        })
        : this.prismaService.permission.update({
            where: {
                id: permissionId
            },           
            data: {
                deletedAt: new Date()
            }
        })

    }
}