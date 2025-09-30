import { createZodDto } from "nestjs-zod";
import { BrandTranslationDetailSchema, CreateBrandTranslationBodySchema, GetBrandTranslationParamsSchema, UpdateBrandTranslationBodySchema } from "./brand-translation.model";

export class GetBrandTranslationParamsDTO extends createZodDto(GetBrandTranslationParamsSchema) {}

export class CreateBrandTranslationBodyDTO extends createZodDto(CreateBrandTranslationBodySchema) {}

export class UpdateBrandTranslationBodyDTO extends createZodDto(UpdateBrandTranslationBodySchema) {}

export class GetBrandTranslationDetailDTO extends createZodDto(BrandTranslationDetailSchema) {}