import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import {  CreateBrandTranslationBodyType, UpdateBrandTranslationBodyType } from "./brand-translation.model";
import { BrandTranslationType } from "src/shared/models/shared-brand-translation.model";

@Injectable() 
export class BrandTranslationRepository {
    constructor(private readonly prismaService: PrismaService) {}

    findById(id: number) : Promise<BrandTranslationType | null> {
        return this.prismaService.brandTranslation.findUnique({
            where: {
                id,
                deletedAt: null
            }
        })
    }

    create({
        data,
        createdById
    }: {
        data: CreateBrandTranslationBodyType,
        createdById: number
    }) {
        return this.prismaService.brandTranslation.create({
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
        data: UpdateBrandTranslationBodyType,
        updatedById: number
    }) {
        return this.prismaService.brandTranslation.update({
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

    delete(id: number, isHard? : boolean) : Promise<BrandTranslationType> {
        return isHard ? 
        this.prismaService.brandTranslation.delete({
            where: {
                id
            }
        })
        : this.prismaService.brandTranslation.update({
            where: {
                id
            },           
            data: {
                deletedAt: new Date()
            }
        })
    }
}