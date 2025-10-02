import z from "zod";

export const CategoryTranslationSchema = z.object({
    id: z.number(),
    categoryId: z.number(),
    languageId: z.string().max(10),
    name: z.string().max(500),
    description: z.string(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

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

export type CategoryTranslationType = z.infer<typeof CategoryTranslationSchema>
export type GetCategoryTranslationDetailType = z.infer<typeof GetCategoryTranslationDetailSchema>
export type CategoryTransalationParamsType = z.infer<typeof CategoryTransalationParamsSchema>
export type CreateCategoryTranslationBodyType = z.infer<typeof CreateCategoryTranslationBodySchema>
export type UpdateCategoryTranslationBodyType = z.infer<typeof UpdateCategoryTranslationBodySchema>


