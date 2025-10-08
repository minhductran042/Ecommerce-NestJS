import z from "zod";
import { CategoryIncludeTranslationSchema } from "../category/category.model";
import { BrandIncludeTranslationSchema } from "../brand/brand.model";
import { ProductTranslationSchema } from "./product-translation/product-translation.model";
import { ProductSchema, VariantsType } from "src/shared/models/shared-product.model";
import { SKUSchema } from "src/shared/models/shared-sku.model";
import { UpsertSKUBodySchema } from "./sku.model";


function generateSKUs(variants: VariantsType) {
  // Hàm hỗ trợ để tạo tất cả tổ hợp
  function getCombinations(arrays: string[][]): string[] {
    return arrays.reduce((acc, curr) => acc.flatMap((x) => curr.map((y) => `${x}${x ? '-' : ''}${y}`)), [''])
  }

  // Lấy mảng các options từ variants
  const options = variants.map((variant) => variant.options)

  // Tạo tất cả tổ hợp
  const combinations = getCombinations(options)

  // Chuyển tổ hợp thành SKU objects
  return combinations.map((value) => ({
    value,
    price: 0,
    stock: 100,
    image: '',
  }))
}


export const GetProductQuerySchema = z.object({
    page: z.coerce.number().positive().int().default(1),
    limit: z.coerce.number().positive().int().default(10),
    name: z.string().optional(),
    brandIds: z.array(z.coerce.number().int().positive()).optional(),
    categories: z.array(z.coerce.number().int().positive()).optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
})

export const GetProductParamsSchema = z.object({
    productId: z.coerce.number()
}).strict()

export const GetProductsResSchema = z.object({
    data: z.array(ProductSchema.extend({
        productTranslations: z.array(ProductTranslationSchema),
    })),
    totalItems: z.number(),
    totalPages: z.number(),
    page: z.number(),
    limit: z.number()
})

export const GetProductDetailResSchema = ProductSchema.extend({
    productTranslation: z.array(ProductTranslationSchema),
    skus: z.array(z.object(SKUSchema)),
    categories: z.array(CategoryIncludeTranslationSchema),
    brand: BrandIncludeTranslationSchema
})

export const CreateProductBodySchema = ProductSchema.pick({
  publishedAt: true,
  name: true,
  basePrice: true,
  virtualPrice: true,
  brandId: true,
  images: true,
  variants: true,
})
  .extend({
    categories: z.array(z.coerce.number().int().positive()),
    skus: z.array(UpsertSKUBodySchema),
  })
  .strict()
  .superRefine(({ variants, skus }, ctx) => {
    // Kiểm tra xem số lượng SKU có hợp lệ hay không: (Người dùng có gửi thiếu hay không)
    const generatedSKUs = generateSKUs(variants);
    if(generatedSKUs.length !== skus.length) {
      return ctx.addIssue({
        code: 'custom',
        message: `Number of SKUs (${skus.length}) does not match the expected number (${generatedSKUs.length}) based on variants`,
    })}

    // Kiểm tra xem các SKU có hợp lệ hay không (Có gửi )
    let wrongSKU = -1
    const isValidSKUs = skus.every((sku, index) => {
      const isValid = sku.value === generateSKUs[index].value
      if(!isValid) wrongSKU = index
      return isValid
    })

    if(!isValidSKUs) {
      return ctx.addIssue({
        code: 'custom',
        message: `SKU at index ${wrongSKU} with value "${skus[wrongSKU].value}" is invalid. Expected value is "${generatedSKUs[wrongSKU].value}"`,
      })
    }
  })


export const UpdateProductBodySchema = CreateProductBodySchema

export type ProductType = z.infer<typeof ProductSchema>
export type GetProductQueryType = z.infer<typeof GetProductQuerySchema>
export type GetProductParamsType = z.infer<typeof GetProductParamsSchema>
export type GetProductsResType = z.infer<typeof GetProductsResSchema>
export type GetProductDetailResType = z.infer<typeof GetProductDetailResSchema>
export type CreateProductBodyType = z.infer<typeof CreateProductBodySchema>
export type UpdateProductBodyType = z.infer<typeof UpdateProductBodySchema>

