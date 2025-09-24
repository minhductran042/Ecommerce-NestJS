import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { CreateUserBodyType, GetUserQueryType, GetUsersResType, UpdateUserBodyType } from "./user.model";
import { UserType } from "src/shared/models/share-user.model";

@Injectable()
export class UserRepository {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async list(pagination: GetUserQueryType) : Promise<GetUsersResType> {
        const page = pagination.page
        const limit = pagination.limit
        const skip = (page - 1) * limit
        const take = limit

        const [totalItems, data] = await Promise.all([
            this.prismaService.user.count({
                where: {
                    deletedAt: null
                }
            }),
            this.prismaService.user.findMany({
                where: {
                    deletedAt: null
                },
                skip,
                take,
                include: {
                    role: true
                }
            })
        ])

        return {
            data,
            totalItems,
            page,
            limit,
            totalPages: Math.ceil(totalItems / limit)
        }
    }

    create({
        data,
        createdById
    } : {
        data: CreateUserBodyType,
        createdById: number
    }) : Promise<UserType> {
        return this.prismaService.user.create({
            data: {
                ...data,
                createdById
            }
        })
    }


    delete(userId: number, isHard? : boolean) : Promise<UserType> {
        return isHard ? 
        this.prismaService.user.delete({
            where: {
                id: userId
            }
        })
        : this.prismaService.user.update({
            where: {
                id: userId
            },           
            data: {
                deletedAt: new Date()
            }
        })
    }
}