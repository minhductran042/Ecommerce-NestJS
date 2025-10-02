import { Body, Controller , Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateCategoryBodyDTO,  GetAllCategoriesQueryDTO, GetAllCategoriesResDTO, GetCategoryDetailDTO, GetCategoryParamsDTO, UpdateCategoryBodyDTO } from './category.dto';
import { IsPublic } from 'src/shared/decorator/isPublic.decorator';
import { GetCategoryDetailSchema } from './category.model';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @IsPublic()
    @ZodSerializerDto(GetAllCategoriesResDTO)
    list(@Query() query: GetAllCategoriesQueryDTO) {
        return this.categoryService.getAllCategories(query);
    }

    @Get(':categoryId')
    @IsPublic()
    @ZodSerializerDto(GetCategoryDetailDTO)
    findById(@Param() params: GetCategoryParamsDTO, @Query() query: GetAllCategoriesQueryDTO) {
        return this.categoryService.getCategoryById(params.categoryId);
    }   

    @Post()
    @ZodSerializerDto(GetCategoryDetailDTO)
    create(@Body() body: CreateCategoryBodyDTO, @ActiveUser('userId') createdById: number) {
        return this.categoryService.create({
            data: body,
            createdById
        });
    }

    @Put(':categoryId')
    @ZodSerializerDto(GetCategoryDetailDTO)
    update(@Param() params: GetCategoryParamsDTO, @Body() body: UpdateCategoryBodyDTO, @ActiveUser('userId') updatedById: number) {
        return this.categoryService.update({
            categoryId: params.categoryId,
            data: body,
            updatedById
        });
    }

    @Delete(':categoryId')
    @ZodSerializerDto(MessageResDTO)
    delete(@Param() params: GetCategoryParamsDTO) {
        return this.categoryService.delete(params.categoryId);
    }
}
