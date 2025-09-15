import { createZodDto } from 'nestjs-zod';
import { z } from 'zod'
import { CreateLanguageBodySchema, GetLanguageDetailShema, GetLanguageParamsSchema, GetLanguagesResSchema, LanguageSchema, UpdateLanguageBodySchema } from './language.model';
import { create } from 'domain';


export class GetLanguagesResDTO extends createZodDto(GetLanguagesResSchema) {}

export class CreateLanguageBodyDTO extends createZodDto(CreateLanguageBodySchema) {}

export class GetLanguageDetailDTO extends createZodDto(GetLanguageDetailShema) {}

export class GetLanguageParamsDTO extends createZodDto(GetLanguageParamsSchema) {}

export class UpdateLanguageBodyDTO extends createZodDto(UpdateLanguageBodySchema) {}

