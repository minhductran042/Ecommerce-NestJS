import z from "zod";
import { CategoryTranslationSchema } from "./category-translation/category-translation.model";

export const CategorySchema = z.object({
    id: z.number(),
    parentCategoryId: z.number().nullable(),
    name: z.string().max(500),
    logo: z.string().max(500).nullable(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    updatedAt: z.date(),
    createdAt: z.date(),
    deletedAt: z.date().nullable()
})

export const GetCategoryDetailSchema = CategorySchema

export const CategoryIncludeCategoriesTranslationSchema = CategorySchema.extend({
    categoryTranslations: z.array(CategoryTranslationSchema) 
})

export const GetAllCategoriesResBodySchema = z.object({
    data: z.array(CategoryIncludeCategoriesTranslationSchema),
    totalItems: z.number()
})

export const GetAllCategoriesQuerySchema = z.object({
    parentCategoryId: z.coerce.number().positive().optional()
})

export const GetCategoryParamsSchema = z.object({
    categoryId: z.coerce.number().int()
}).strict()

export const CreateCategoryBodySchema = z.object({
    parentCategoryId: z.number().nullable(),
    name: z.string().max(500),
    logo: z.string().max(500).nullable(),
}).strict()

export const UpdateCategoryBodySchema = CreateCategoryBodySchema

export type CategoryType = z.infer<typeof CategorySchema>
export type GetCategoryDetailType = z.infer<typeof GetCategoryDetailSchema>
export type GetAllCategoriesResBodyType = z.infer<typeof GetAllCategoriesResBodySchema>
export type GetCategoryQueryType = z.infer<typeof GetAllCategoriesQuerySchema>
export type GetCategoryParamsType = z.infer<typeof GetCategoryParamsSchema>
export type CreateCategoryBodyType = z.infer<typeof CreateCategoryBodySchema>
export type UpdateCategoryBodyType = z.infer<typeof UpdateCategoryBodySchema>
export type CategoryIncludeCategoriesTranslationType = z.infer<typeof CategoryIncludeCategoriesTranslationSchema>
