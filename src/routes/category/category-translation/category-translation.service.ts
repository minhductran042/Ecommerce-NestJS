import { Injectable } from '@nestjs/common';
import { CategoryTranslationRepository } from './category-translation.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError } from 'src/shared/helper';
import { CreateCategoryTranslationBodyType, UpdateCategoryTranslationBodyType } from './category-translation.model';

@Injectable()
export class CategoryTranslationService {
    constructor(private readonly categoryTranslationRepository: CategoryTranslationRepository) {}

    async findById(categoryTranslationId: number) {
        try {
            const categoryTranslation = await this.categoryTranslationRepository.findById(categoryTranslationId);
            return categoryTranslation;
        } catch (error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException
            }
            throw error
        }
    }

    async create({
        data,
        createdById
    }: {
        data: CreateCategoryTranslationBodyType,
        createdById: number
    }) {
        try {
            return await this.categoryTranslationRepository.create({
                data,
                createdById
            })
        } catch (error) {
            throw error
        }       
    }

    async update({
        categoryTranslationId,
        data,
        updatedById
    }: {
        categoryTranslationId: number,
        data: UpdateCategoryTranslationBodyType,
        updatedById: number
    }) {
        try {
            const categoryTranslation = await this.categoryTranslationRepository.findById(categoryTranslationId);
            if(!categoryTranslation) {
                throw NotFoundRecordException
            }
            return await this.categoryTranslationRepository.update({
                id: categoryTranslationId,
                data,
                updatedById
            })
        } catch (error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException
            }
            throw error
        }
    }

    async delete(categoryTranslationId: number) {
        try {
            const categoryTranslation = await this.categoryTranslationRepository.findById(categoryTranslationId);
            if(!categoryTranslation) {
                throw NotFoundRecordException
            }
            await this.categoryTranslationRepository.delete(categoryTranslationId);
            return "Deleted Category Translation Successfully"
        } catch (error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException
            }
            throw error
        }
    }
}
