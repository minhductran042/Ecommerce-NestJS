import { z } from 'zod'

export const BrandTranslationSchema = z.object({
    id: z.number(),
    brandId: z.number(),
    languageId: z.string().max(10),
    name: z.string().max(500),
    description: z.string(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const BrandTranslationDetailSchema = BrandTranslationSchema

export const GetBrandTranslationParamsSchema = z.object({
    id: z.coerce.number()
})

export const CreateBrandTranslationBodySchema = BrandTranslationSchema.pick({
    brandId: true,
    languageId: true,
    name: true,
    description: true,
}).strict()

export const UpdateBrandTranslationBodySchema = CreateBrandTranslationBodySchema

export type BrandTranslationType = z.infer<typeof BrandTranslationSchema>
export type CreateBrandTranslationBodyType = z.infer<typeof CreateBrandTranslationBodySchema>
export type UpdateBrandTranslationBodyType = z.infer<typeof UpdateBrandTranslationBodySchema>
export type BrandTranslationDetailType = z.infer<typeof BrandTranslationDetailSchema>
export type GetBrandTranslationParamsType = z.infer<typeof GetBrandTranslationParamsSchema>