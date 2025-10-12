import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import {  CreateProductBodyType, GetProductDetailResType, GetProductQueryType, GetProductsResType, UpdateProductBodyType } from "./product.model";
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

    async update({
        productId,
        data,
        updatedById
    }: {
        productId: number,
        data: UpdateProductBodyType
        updatedById: number | null,
    }) : Promise<any> {
        const {skus: dataSKUs, categories, ...productData} = data;
        // SKU đã tồn tại trong DB nhưng không có trong data payload thì sẽ bị xóa

        //SKU đã tồn tại trong DB nhưng có trong data payload thì sẽ được cập nhật

        //SKU không có trong DB nhưng có trong data payload thì sẽ được thêm mới

        //Xoa SKU 

        //1. Lấy SKU hiện tại trong DB
        const existingSKUs = await this.prismaService.sKU.findMany({
            where: {
                productId,
                deletedAt: null
            }
        })

        //2. Tìm các SKU cần xóa (Tồn tại trong DB nhưng không có trong payload)
        const skuToDelete = existingSKUs.filter(sku => dataSKUs.every(dataSKU => dataSKU.value !== sku.value))

        const skuToDeleteIds = skuToDelete.map(sku => sku.id)

        //3. Mapping Id vao data payload
        const skusWithId = dataSKUs.map((sku) => {
            const existingSKU = existingSKUs.find((existing) => existing.value === sku.value) // tìm SKU trong DB có value bằng value của SKU trong payload
            return {
                ...sku,
                id: existingSKU ? existingSKU.id : null,
            }
        })


        //4.SKU để cập nhật:  SKU đã tồn tại trong DB nhưng có trong data payload thì sẽ được cập nhật
        const skuToUpdate = skusWithId.filter(sku => sku.id !== null) 

        //5. SKU để thêm mới: SKU không tồn tại trong DB nhưng có trong data payload thì sẽ được thêm mới
        const skusToCreate = skusWithId
            .filter((sku) => sku.id === null)
            .map((sku) => {
                const { id: skuId, ...data } = sku
                return {
                ...data,
                productId: productId,
                createdById: updatedById,
                }
            })

        
        await this.prismaService.$transaction([
            //Xoa mem SKU neu ton tai trong database ma khong co trong payload
            this.prismaService.sKU.updateMany({
                where: {
                    id: {in : skuToDeleteIds}
                },
                data: {
                    deletedAt: new Date(),
                }
            }),

            //Cập nhật SKU có trong payload
            ...skuToUpdate.map(sku => this.prismaService.sKU.update({ // Dấu 3... để trải mảng thành các phần tử riêng biệt
                where: {
                    id: sku.id as number
                },
                data: {
                    value: sku.value,
                    price: sku.price,
                    stock: sku.stock,
                    image: sku.image,
                }
            })),
            //Tạo mới SKU không có trong DB

            this.prismaService.sKU.createMany({
                data: skusToCreate
            })
        ])
        
    }
}