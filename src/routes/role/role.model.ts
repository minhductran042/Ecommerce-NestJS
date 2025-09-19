
import { permission } from 'process'
import { z } from 'zod'
import { PermissionSchema } from '../permission/permission.model'
import { datacatalog_v1beta1 } from 'googleapis'

export const RoleShema = z.object({
    id: z.number(),
    name: z.string().max(500),
    description: z.string(),
    isActive: z.boolean().default(true),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable()
})

export const RoleWithPermissionsSchema = RoleShema.extend({
    permissions: z.array(PermissionSchema)
})

export const GetRolesResSchema = z.object({
    roles: z.array(RoleShema),
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
})

export const GetRoleDetailSchema = RoleShema

export const CreateRoleBodySchema = RoleShema.pick({
    name: true,
    description: true,
    isActive: true
}).strict()

export const GetRoleQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10)
}).strict()

export const GetRoleParamsSchema = z.object({
    roleId: z.coerce.number().int()
}).strict()


export const UpdateRoleBodyShema = RoleShema.pick({
    name: true,
    description: true,
    isActive: true
}).extend({
    permissionIds: z.array(z.number()) 
}).strict()

export type RoleType = z.infer<typeof RoleShema>
export type RoleWithPermissionsType = z.infer<typeof RoleWithPermissionsSchema>
export type GetRoleDetailType = z.infer<typeof GetRoleDetailSchema>
export type CreateRoleBodyType = z.infer<typeof CreateRoleBodySchema>
export type GetRoleParamsType = z.infer<typeof GetRoleParamsSchema>
export type UpdateRoleBodyType = z.infer<typeof UpdateRoleBodyShema>
export type GetRoleQueryType = z.infer<typeof GetRoleQuerySchema>
export type GetRolesResType = z.infer<typeof GetRolesResSchema>