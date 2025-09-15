import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { CreateLanguageBodyType, LanguageType, UpdateLanguageBodyType } from "./language.model";
import { language } from "googleapis/build/src/apis/language";
import { LanguageModule } from "./language.module";

@Injectable()
export class LanguageRepository {

    constructor(
        private readonly prismaService: PrismaService
    ) {}

    findAll() : Promise<LanguageType[]> {
        return this.prismaService.language.findMany({
            where: {
                deletedAt: null
            }
        }) 
    }

    findById(id: string) : Promise<LanguageType | null> {
        return this.prismaService.language.findFirst({
            where: {
                id,
                deletedAt: null
            }
        })
    }
    
    create({data, createdById} : { data: CreateLanguageBodyType, createdById: number }) : Promise<LanguageType> {
        return this.prismaService.language.create({
            data: {
                ...data,
                createdById,
            }
        }) as any
    }

    update({
        languageId, 
        updatedById, 
        data
    } : {languageId: string; updatedById: number; data: UpdateLanguageBodyType}) : Promise<LanguageType> {
        return this.prismaService.language.update({
            where: {
                id: languageId,
                deletedAt: null
            },
            data: {
                ...data,
                updatedById: updatedById
            }
        }) as any // as any để tránh lỗi type của prisma
    }

    delete(languageId: string, isHard? : boolean) : Promise<LanguageType> {
        if(isHard) {
            return this.prismaService.language.delete({
                where: {
                    id: languageId
                }
            }) as any
        } else {
            return this.prismaService.language.update({
                where: {
                    id: languageId,
                    deletedAt: null
                }, 
                data: {
                    deletedAt: new Date()
                }
            })
        }
    }


} 