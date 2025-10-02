import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryTranslationService } from './category-translation.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { CategoryTranslationParamsDTO, CreateCategoryTranslationBodyDTO, GetCategoryTranslationDetailDTO, UpdateCategoryTranslationBodyDTO } from './category-translation.dto';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';

@Controller('category-translation')
export class CategoryTranslationController {
    constructor(private readonly categoryTranslationService: CategoryTranslationService) {}

    @Get(':categoryTranslationId')
    @ZodSerializerDto(GetCategoryTranslationDetailDTO)
    findById(@Param() param: CategoryTranslationParamsDTO) {
        return this.categoryTranslationService.findById(param.categoryTranslationId)
    }

    @Post()
    @ZodSerializerDto(GetCategoryTranslationDetailDTO)
    create(@Body() body: CreateCategoryTranslationBodyDTO, @ActiveUser('userId') createdById: number) {
        return this.categoryTranslationService.create({
            data: body,
            createdById
        })
    }

    @Put(':categoryTranslationId')
    @ZodSerializerDto(GetCategoryTranslationDetailDTO)
    update(@Param() param: CategoryTranslationParamsDTO, @Body() body: UpdateCategoryTranslationBodyDTO, @ActiveUser('userId') updatedById: number) {
        return this.categoryTranslationService.update({
            categoryTranslationId: param.categoryTranslationId,
            data: body,
            updatedById
        })
    }

    @Delete(':categoryTranslationId')
    @ZodSerializerDto(MessageResDTO)
    delete(@Param() param: CategoryTranslationParamsDTO) {
        return this.categoryTranslationService.delete(param.categoryTranslationId)
    }
}
