import { CategoryTranslationSchema } from "src/shared/models/shared-category-translation.model";
import z from "zod";



export const GetCategoryTranslationDetailSchema = CategoryTranslationSchema

export const CategoryTransalationParamsSchema = z.object({
    categoryTranslationId: z.coerce.number().int()
}).strict()

export const CreateCategoryTranslationBodySchema = CategoryTranslationSchema.pick({
    categoryId: true,
    languageId: true,
    name: true,
    description: true,
}).strict()

export const UpdateCategoryTranslationBodySchema = CreateCategoryTranslationBodySchema

export type GetCategoryTranslationDetailType = z.infer<typeof GetCategoryTranslationDetailSchema>
export type CategoryTransalationParamsType = z.infer<typeof CategoryTransalationParamsSchema>
export type CreateCategoryTranslationBodyType = z.infer<typeof CreateCategoryTranslationBodySchema>
export type UpdateCategoryTranslationBodyType = z.infer<typeof UpdateCategoryTranslationBodySchema>


