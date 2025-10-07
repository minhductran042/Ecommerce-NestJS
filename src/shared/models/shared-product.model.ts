import z from "zod";

export const VariantSchema = z.object({
  value: z.string(),
  options: z.array(z.string())
});

export const VariantsSchema = z.array(VariantSchema).superRefine((variants, ctx) => {
    //Kiểm tra xem varients và varientOptions có trùng nhau không
    for(let i=0;i < variants.length; i ++) {
        const variant = variants[i];
        const isExistingVarients = variants.findIndex(v => v.value.toLowerCase() === variant.value.toLowerCase()) !== i;
        if(isExistingVarients) {
            ctx.addIssue({
                code: 'custom',
                message: `Variant ${variant.value} is duplicated`,
                path: ['value']
            });
        }

        const isDifferentOptions = variant.options.some((option, index) => { // some trả về true nếu có ít nhất 1 phần tử
            const isExistingOptions = variant.options.findIndex(o => o.toLowerCase() === option.toLowerCase()) !== index;
            return isExistingOptions;
        })
        
        if(isDifferentOptions) {
            ctx.addIssue({
                code: 'custom',
                message: `Options in variant ${variant.value} are duplicated`,
                path: ['options']
            });
        }
        
    }
});

export const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    basePrice: z.number(),
    vituralPrice: z.number(),
    images: z.array(z.string()),
    brandId: z.number(),
    variants: VariantsSchema,

    publishedAt: z.coerce.date().nullable(),
    deletedById: z.number().nullable(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable()
})

export type ProductType = z.infer<typeof ProductSchema>;
export type VariantsType = z.infer<typeof VariantsSchema>;

