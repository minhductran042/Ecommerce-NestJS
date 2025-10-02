import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repo';
import { CreateCategoryBodyType, GetCategoryQueryType, UpdateCategoryBodyType } from './category.model';
import { I18nContext } from 'nestjs-i18n';
import { NotFoundRecordException } from 'src/shared/error';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async getAllCategories(query: GetCategoryQueryType) {
        const categories = await this.categoryRepository.list({
            parentCategoryId: query.parentCategoryId,
            languageId: I18nContext.current()?.lang as string
        })
        return categories
    }

    async getCategoryById(categoryId: number) {
        const category = await this.categoryRepository.findById({
            categoryId,
            languageId: I18nContext.current()?.lang as string
        })
        return category
    }

    async create({
        data,
        createdById
    } : {
        data: CreateCategoryBodyType,
        createdById: number
    }) {
        try {
            return await this.categoryRepository.create({
                data,
                createdById
            })
        } catch (error) {
            throw error
        }
        
    }

    async update({
        categoryId,
        data,
        updatedById
    }: {
        categoryId: number,
        data: UpdateCategoryBodyType,
        updatedById: number
    }) {
        try {

            const category = await this.categoryRepository.findById({
                categoryId,
                languageId: I18nContext.current()?.lang as string
            })

            if(!category) {
                throw NotFoundRecordException
            }

            return await this.categoryRepository.update({
                categoryId,
                data,
                updatedById
            })   
        } catch (error) {
            throw error
        }
    }

    async delete(categoryId: number) {
        try {
            const category = await this.categoryRepository.findById({
                categoryId,
                languageId: I18nContext.current()?.lang as string
            })
            if(!category) {
                throw NotFoundRecordException
            }
            await this.categoryRepository.delete(categoryId)
            return "Delete category successfully"
        } catch (error) {
            throw error
        }
    }
}
