
import { z } from 'zod'
import { BrandTranslationSchema } from './brandTranslation/brand-translation/brand-translation.model'

export const BrandSchema = z.object({
    id: z.number(),
    logo: z.string(),
    name: z.string().max(500),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const BrandIncludeTranslationSchema = BrandSchema.extend({
    brandTranslations: z.array(BrandTranslationSchema)
})

export const GetBrandsResSchema = z.object({
    data: z.array(BrandIncludeTranslationSchema),
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
})

export const GetBrandQuerySchema = z.object({
    page: z.coerce.number().positive().default(1),
    limit: z.coerce.number().positive().default(10)
})

export const GetBrandParamsSchema = z.object({
    brandId: z.coerce.number()
})

export const GetBrandDetailSchema = BrandSchema

export const CreateBrandBodySchema = BrandSchema.pick({
    logo: true,
    name: true,
}).strict()

export const UpdateBrandBodySchema = BrandSchema.pick({
    logo: true,
    name: true,
}).strict()

export type BrandType = z.infer<typeof BrandSchema>
export type GetBrandsResType = z.infer<typeof GetBrandsResSchema>
export type GetBrandQueryType = z.infer<typeof GetBrandQuerySchema>
export type GetBrandParamsType = z.infer<typeof GetBrandParamsSchema>
export type GetBrandDetailType = z.infer<typeof GetBrandDetailSchema>
export type CreateBrandBodyType = z.infer<typeof CreateBrandBodySchema>
export type UpdateBrandBodyType = z.infer<typeof UpdateBrandBodySchema>
export type BrandIncludeTranslationType = z.infer<typeof BrandIncludeTranslationSchema>