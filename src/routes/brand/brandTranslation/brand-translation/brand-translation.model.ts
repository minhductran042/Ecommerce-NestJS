import { BrandTranslationSchema } from 'src/shared/models/shared-brand-translation.model'
import { z } from 'zod'


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

export type CreateBrandTranslationBodyType = z.infer<typeof CreateBrandTranslationBodySchema>
export type UpdateBrandTranslationBodyType = z.infer<typeof UpdateBrandTranslationBodySchema>
export type BrandTranslationDetailType = z.infer<typeof BrandTranslationDetailSchema>
export type GetBrandTranslationParamsType = z.infer<typeof GetBrandTranslationParamsSchema>