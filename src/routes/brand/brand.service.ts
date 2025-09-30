import { Injectable } from '@nestjs/common';
import { BrandRepository } from './brand.repo';
import { CreateBrandBodyType, GetBrandQueryType, UpdateBrandBodyType } from './brand.model';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError } from 'src/shared/helper';

@Injectable()
export class BrandService {
    constructor(private readonly brandRepository: BrandRepository) {}

    list(pagination: GetBrandQueryType) {
        return this.brandRepository.list(pagination)
    }

    async findById(brandId: number) {
        try {
            return await this.brandRepository.findById(brandId)
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
        data: CreateBrandBodyType,
        createdById: number
    }) {
        try {
            return await this.brandRepository.create({
                data,
                createdById
            })
        } catch (error) {
            throw error
        }
    }

    async update({
        brandId,
        data,
        updatedById
    }: {
        brandId: number,
        data: UpdateBrandBodyType,
        updatedById: number
    }) {
        try {

            const brand = await this.brandRepository.findById(brandId)
            if(!brand) {
                throw NotFoundRecordException
            }

            return await this.brandRepository.update({
                brandId,
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

    async delete(brandId: number) {
        try {
            const brand = await this.brandRepository.findById(brandId)
            if(!brand) {
                throw NotFoundRecordException
            }

            await this.brandRepository.delete(brandId)
            return {
                message: 'Delete brand successfully'
            }
        } catch (error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException
            }
            throw error
        }
    }
}
