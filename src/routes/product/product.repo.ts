import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { GetProductQueryType, GetProductsResType } from "./product.model";
import { ALL_LANGUAGE_CODE } from "src/shared/constants/other.const";

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
    
}