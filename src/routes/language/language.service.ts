import { Injectable } from '@nestjs/common';
import { LanguageRepository } from './language.repo';
import { NotFoundRecordException } from 'src/shared/models/error.model';
import { CreateLanguageBodyType, GetLanguageParamsType, UpdateLanguageBodyType } from './language.model';
import { isUniqueConstraintPrismaError } from 'src/shared/helper';
import { LanguageAlreadyExistsError } from './language.error';

@Injectable()
export class LanguageService {
    constructor(
        private readonly languageRepository: LanguageRepository
    ) {}

    async findAll() {
        const languages = await this.languageRepository.findAll()
        return {
            data: languages,
            totalItems: languages.length
        }
    }

    async findById(id: string) {
        const language = await this.languageRepository.findById(id)
        if(!language) {
            throw NotFoundRecordException
        }
        return language
    }

    async create({ data, createdById} : { data: CreateLanguageBodyType ; createdById: number }) {
        try {
            const language = await this.languageRepository.create({
            data,
            createdById
        })
            return language
        } catch(error) {
            if( isUniqueConstraintPrismaError(error)) {
                throw LanguageAlreadyExistsError
            }
            throw error
        }
    }

    async update({
        languageId,
        updatedById,
        data
    }: {
        languageId: string,
        updatedById: number,
        data: UpdateLanguageBodyType
    }) {
       try {
        return this.languageRepository.update({
            languageId,
            updatedById,
            data
        })
       } catch(error) {
        if(isUniqueConstraintPrismaError(error)) {
            throw NotFoundRecordException
        }
        throw error
       }
    }

    async delete(id: string) {
       try {
         await this.languageRepository.delete(id, true)
        return {
            message: 'Delete language successfully'
        }
       } catch(error) {
        if(isUniqueConstraintPrismaError(error)) {
            throw NotFoundRecordException
        }
        throw error
       }
    }

    


}
