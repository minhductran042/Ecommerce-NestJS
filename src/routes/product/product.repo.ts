import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import {  CreateProductBodyType, GetProductDetailResType, GetProductQueryType, GetProductsResType } from "./product.model";
import { ALL_LANGUAGE_CODE } from "src/shared/constants/other.const";
import is from "zod/v4/locales/is.js";

@Injectable()
export class ProductRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async list(query: GetProductQueryType, languageId: string) : Promise<GetProductsResType>{
        const skip = (query.page - 1) * query.limit;
        const take = query.limit;

        const [totalItems, data] = await Promise.all([
            this.prismaService.product.count({
                where: {
                    deletedAt: null
                }
            }),

            this.prismaService.product.findMany({
                where: {
                    deletedAt: null
                },
                include: {
                    productTranslations: {
                        where: languageId === ALL_LANGUAGE_CODE ? {deletedAt: null} : {languageId, deletedAt: null},
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take
            })
        ])  
        return {
            data,
            totalItems,
            totalPages: Math.ceil(totalItems / take),
            page: query.page,
            limit: take
        }
    }

    findById(id: number, languageId: string) : Promise<GetProductDetailResType | null> {
        return this.prismaService.product.findUnique({
            where: {
                id,
                deletedAt: null
            },
            include: {
                productTranslations: {
                    where: languageId === ALL_LANGUAGE_CODE ? {deletedAt: null} : {languageId, deletedAt: null},
                },
                skus: {
                    where: {
                        deletedAt: null
                    }
                },
                brand: {
                    include: {
                        brandTranslations: {
                            where: languageId === ALL_LANGUAGE_CODE ? {deletedAt: null} : {languageId, deletedAt: null},
                        }
                    }
                },
                categories: {
                    where: {
                        deletedAt: null
                    },
                    include: {
                        categoryTranslations: {
                            where: languageId === ALL_LANGUAGE_CODE ? {deletedAt: null} : {languageId, deletedAt: null},
                        }
                    }
                }
            }
        })
    }
    
    async delete({
        id,
        deletedById,
    } : {
        id: number,
        deletedById: number | null,
    }, 
    isHard?: boolean
    ) {
        if(isHard) {
            const [product] = await Promise.all([
                this.prismaService.product.delete({
                    where: {id}
                }),
                this.prismaService.sKU.deleteMany({
                    where: {productId: id}
                })
            ])
            return product
        } else {
            const [product] = await Promise.all([
                this.prismaService.product.update({
                    where: {id},
                    data: {
                        deletedAt: new Date(),
                        deletedById
                    }
                }),
                this.prismaService.sKU.updateMany({
                    where: {productId: id},
                    data: {
                        deletedAt: new Date()
                    }
                })
            ])
            return product
        }
    }


    async create({
        data,
        createdById
    }: {
        data: CreateProductBodyType,
        createdById: number | null,
    }) : Promise<GetProductDetailResType> {
        const {skus, categories, ...productData} = data;
        const createdProduct = await this.prismaService.product.create({
            data: {
                ...productData,
                categories: {
                    connect: categories.map((category) => ({ id: category })) // 
                },
                skus: {
                    createMany: {
                        data: skus
                    }
                }
            },
            include: {
                productTranslations: {
                    where: {
                        deletedAt: null
                    }
                },
                skus: {
                    where: {
                        deletedAt: null
                    }
                },
                brand: {
                    include: {
                        brandTranslations: {
                            where: {
                                deletedAt: null
                            }
                        }
                    }
                },
                categories: {
                    where: {
                        deletedAt: null
                    },
                    include: {
                        categoryTranslations: {
                            where: {
                                deletedAt: null
                            }
                        }
                    }
                }
            }
        })

        return createdProduct
    }
}