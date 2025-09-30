import { Injectable } from '@nestjs/common';
import { BrandTranslationRepository } from './brand-translation.repo';
import { isForeignKeyConstraintPrismaError, isNotFoundPrismaError } from 'src/shared/helper';
import { NotFoundRecordException } from 'src/shared/error';
import { CreateBrandTranslationBodyType } from './brand-translation.model';

@Injectable()
export class BrandTranslationService {
    constructor(
        private readonly brandTranslationRepository: BrandTranslationRepository
    ) {}

    async findById(id: number) {
        try {
            return await this.brandTranslationRepository.findById(id)
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
        data: CreateBrandTranslationBodyType,
        createdById: number
    }) {
        try {
            return await this.brandTranslationRepository.create({
                data,
                createdById
            })
        } catch (error) {
            if(isForeignKeyConstraintPrismaError(error)) {
                throw error
            }
            throw error
        }
    }

    async update({
        data,
        updatedById,
        id
    }: {
        data: CreateBrandTranslationBodyType,
        updatedById: number,
        id: number
    }) {
        try {
            return await this.brandTranslationRepository.update({
                data,
                updatedById,
                id
            })
        } catch (error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException
            }
            throw error
        }
    }

    async delete(id: number) {
        try {
            return await this.brandTranslationRepository.delete(id)
        } catch (error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException
            }
            throw error
        }
    }
}
