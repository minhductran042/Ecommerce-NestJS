import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { CreateBrandBodySchema, GetBrandDetailSchema, GetBrandParamsSchema, GetBrandQuerySchema, GetBrandsResSchema, UpdateBrandBodySchema } from './brand.model'

export class GetBrandQueryDTO extends createZodDto(GetBrandQuerySchema) {}

export class GetBrandParamsDTO extends createZodDto(GetBrandParamsSchema) {}

export class CreateBrandBodyDTO extends createZodDto(CreateBrandBodySchema) {}

export class UpdateBrandBodyDTO extends createZodDto(UpdateBrandBodySchema) {}

export class GetBrandDetailDTO extends createZodDto(GetBrandDetailSchema) {}

export class GetBrandsResDTO extends createZodDto(GetBrandsResSchema) {}