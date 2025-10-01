import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { BrandIncludeTranslationType, BrandType, CreateBrandBodyType, GetBrandDetailType, GetBrandParamsType, GetBrandQueryType, GetBrandsResType, UpdateBrandBodyType } from "./brand.model";
import { ALL_LANGUAGE_CODE } from "src/shared/constants/other.const";

@Injectable()
export class BrandRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async list(pagination: GetBrandQueryType, languageId: string) : Promise<GetBrandsResType> {
        const skip = (pagination.page - 1) * pagination.limit
        const take = pagination.limit
        const [totalItems, data] = await Promise.all([
            this.prismaService.brand.count({
                where: {
                    deletedAt: null
                }
            }),
            this.prismaService.brand.findMany({
                where: {
                    deletedAt: null
                },
                include: {
                    brandTranslations: {
                        where: languageId === ALL_LANGUAGE_CODE ? 
                        {
                            deletedAt: null
                        } 
                        : {
                            languageId,
                            deletedAt: null
                        } 
                    }
                },
                skip,
                take,
                orderBy: {
                    createdAt: 'desc'
                }
            })
        ])

        const totalPages = Math.ceil(totalItems / pagination.limit)

        return {
            data,
            totalItems,
            page: pagination.page,
            limit: pagination.limit,
            totalPages
        }
    }
    
    findById(brandId: number, languageId: string) : Promise<BrandIncludeTranslationType | null> {
        return this.prismaService.brand.findUnique({
            where: {
                id: brandId,
                deletedAt: null
            },
            include: {
                brandTranslations: {
                    where: languageId === ALL_LANGUAGE_CODE ? 
                    {
                        deletedAt: null
                    } 
                    : {
                        languageId,
                        deletedAt: null
                    } 
                }
            }
        })
    }

    create({
        data,
        createdById
    }: {
        data: CreateBrandBodyType,
        createdById: number
    }) : Promise<BrandType> {
        return this.prismaService.brand.create({
            data: {
                ...data,
                createdById
            }
        })
    }

    update({
        brandId,
        data,
        updatedById
    }: {
        brandId: number,
        data: UpdateBrandBodyType,
        updatedById: number
    }) : Promise<BrandType> {
        return this.prismaService.brand.update({
            where: {
                id: brandId,
            }, 
            data: {
                ...data,
                updatedById
            }
        })
    }

    delete(brandId: number, isHard? : boolean) : Promise<BrandType> {
        return isHard ? 
        this.prismaService.brand.update({
            where: {
                id: brandId
            },
            data: {
                deletedAt: new Date()
            }
        })
        : this.prismaService.brand.delete({
            where: {
                id: brandId
            }
        })
    }
}