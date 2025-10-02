import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { CategoryTranslationType, CreateCategoryTranslationBodyType, UpdateCategoryTranslationBodyType } from "./category-translation.model";



@Injectable()
export class CategoryTranslationRepository {
    constructor(private readonly prismaService: PrismaService) {}
    
    findById(categoryTranslationId: number) : Promise<CategoryTranslationType | null> {
        return this.prismaService.categoryTranslation.findUnique({
            where: {
                id: categoryTranslationId,
                deletedAt: null
            }
        })
    }

    create({
        data,
        createdById
    }: {
        data: CreateCategoryTranslationBodyType,
        createdById: number
    }) : Promise<CategoryTranslationType> {
        return this.prismaService.categoryTranslation.create({
            data: {
                ...data,
                createdById
            }
        })
    }

    update({
        id,
        data,
        updatedById
    }: {
        id: number,
        data: UpdateCategoryTranslationBodyType,
        updatedById: number
    }) : Promise<CategoryTranslationType> {
        return this.prismaService.categoryTranslation.update({
            where: {
                id,
                deletedAt: null
            },
            data: {
                ...data,
                updatedById
            }
        })
    }

    delete(categoryTranslationId: number, isHard? : boolean) : Promise<CategoryTranslationType> {
        return isHard ? 
        this.prismaService.categoryTranslation.delete({
            where: {
                id: categoryTranslationId
            }
        })
        : this.prismaService.categoryTranslation.update({
            where: {
                id: categoryTranslationId,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
            }
        })
    }   
}