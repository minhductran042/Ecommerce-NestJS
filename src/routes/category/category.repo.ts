import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { CategoryIncludeCategoriesTranslationType, CategoryType, CreateCategoryBodyType, GetAllCategoriesResBodyType, GetCategoryQueryType } from "./category.model";
import { boolean, nullable } from "zod";
import { ALL_LANGUAGE_CODE } from "src/shared/constants/other.const";

@Injectable()
export class CategoryRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async list({
        parentCategoryId,
        languageId
    }: {
        parentCategoryId?: number | null,
        languageId: string
    }) : Promise<GetAllCategoriesResBodyType> {
        const categories = await this.prismaService.category.findMany({
            where: {
                parentCategoryId: parentCategoryId ?? null, // allow null
                deletedAt: null
            },
            include: {
                categoryTranslations: {
                    where: languageId === ALL_LANGUAGE_CODE ? {
                        deletedAt: null
                    } : {
                        languageId,
                        deletedAt: null
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return {
            data: categories,
            totalItems: categories.length
        }
    }

    findById({ 
        categoryId,
        languageId
    }: {
        categoryId: number, 
        languageId: string
    }) : Promise<CategoryIncludeCategoriesTranslationType | null> {
        return this.prismaService.category.findUnique({
            where: {
                id: categoryId,
                deletedAt: null
            }, 
            include: {
                categoryTranslations: {
                    where: languageId === ALL_LANGUAGE_CODE ? {
                        deletedAt: null
                    } : {
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
        data: CreateCategoryBodyType,
        createdById: number | null
    }) : Promise<CategoryIncludeCategoriesTranslationType> {
        return this.prismaService.category.create({
            data: {
                ...data,
                createdById
            },
            include: {
                categoryTranslations: {
                    where: {
                        deletedAt: null
                    }
                }
            }
        })
    }

    update({
        categoryId,
        data,
        updatedById
    }: {
        categoryId: number,
        data: CreateCategoryBodyType,
        updatedById: number | null
    }) : Promise<CategoryIncludeCategoriesTranslationType> {
        return this.prismaService.category.update({
            where: {
                id: categoryId,
            }, 
            data: {
                ...data,
                updatedById
            },
            include: {
                categoryTranslations: {
                    where: {
                        deletedAt: null
                    }
                }
            }
        })
    }

    delete(categoryId: number, isHard? : boolean) : Promise<CategoryType> {
        return isHard ? this.prismaService.category.delete({
            where: {
                id: categoryId,
            }
        }) : this.prismaService.category.update({
            where: {
                id: categoryId,
            }, 
            data: {
                deletedAt: new Date()
            }
        })
    }
}