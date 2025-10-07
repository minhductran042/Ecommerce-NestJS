import { createZodDto } from "nestjs-zod";
import {  CreateCategoryBodySchema, GetAllCategoriesQuerySchema, GetAllCategoriesResBodySchema, GetCategoryDetailSchema, GetCategoryParamsSchema, UpdateCategoryBodySchema } from "./category.model";
import { CategorySchema } from "src/shared/models/shared-category.model";

export class CategoryResDTO extends createZodDto(CategorySchema) {}
export class CreateCategoryBodyDTO extends createZodDto(CreateCategoryBodySchema) {}
export class UpdateCategoryBodyDTO extends createZodDto(UpdateCategoryBodySchema) {}
export class GetCategoryParamsDTO extends createZodDto(GetCategoryParamsSchema) {}
export class GetAllCategoriesQueryDTO extends createZodDto(GetAllCategoriesQuerySchema) {}
export class GetAllCategoriesResDTO extends createZodDto(GetAllCategoriesResBodySchema) {}
export class GetCategoryDetailDTO extends createZodDto(GetCategoryDetailSchema) {}