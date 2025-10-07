import z from "zod";

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

export type CategoryType = z.infer<typeof CategorySchema>