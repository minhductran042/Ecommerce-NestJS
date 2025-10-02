
import { createZodDto } from 'nestjs-zod'
import { CategoryTransalationParamsSchema, CreateCategoryTranslationBodySchema, GetCategoryTranslationDetailSchema, UpdateCategoryTranslationBodySchema } from './category-translation.model'

export class GetCategoryTranslationDetailDTO extends createZodDto(GetCategoryTranslationDetailSchema) {}
export class CategoryTranslationParamsDTO extends createZodDto(CategoryTransalationParamsSchema) {}
export class CreateCategoryTranslationBodyDTO extends createZodDto(CreateCategoryTranslationBodySchema) {}
export class UpdateCategoryTranslationBodyDTO extends createZodDto(UpdateCategoryTranslationBodySchema) {}