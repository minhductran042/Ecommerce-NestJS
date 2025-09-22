import { z } from 'zod'

import { UpdateMeBodySchema, ChangePasswordBodySchema } from './profile.model'
import { createZodDto } from 'nestjs-zod'

export class UpdateMeBodyDTO extends createZodDto(UpdateMeBodySchema) {}

export class ChangePasswordBodyDTO extends createZodDto(ChangePasswordBodySchema) {}
