import { Extensions } from '@prisma/client/runtime/library'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { CreateRoleBodySchema, GetRoleDetailSchema, GetRoleParamsSchema, GetRoleQuerySchema, GetRolesResSchema, UpdateRoleBodyShema } from './role.model'
import { extend } from 'zod/mini'
import { create } from 'domain'
import { RoleWithPermissionsSchema } from 'src/shared/models/shared-role.model'

export class GetRoleQueryBodyDTO extends createZodDto(GetRoleQuerySchema) {}

export class GetRoleDetailDTO extends createZodDto(GetRoleDetailSchema) {}

export class GetRoleParamsDTO extends createZodDto(GetRoleParamsSchema) {}

export class GetRolesResDTO extends createZodDto(GetRolesResSchema) {}

export class RoleWithPermissionsDTO extends createZodDto(RoleWithPermissionsSchema) {}

export class UpdateRoleBodyDTO extends createZodDto(UpdateRoleBodyShema) {}

export class CreateRoleBodyDTO extends createZodDto(CreateRoleBodySchema) {}


