import z from "zod";

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

export type BrandType = z.infer<typeof BrandSchema>