
import { z } from 'zod'
import { RoleShema } from 'src/shared/models/shared-role.model'

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

export type GetRoleDetailType = z.infer<typeof GetRoleDetailSchema>
export type CreateRoleBodyType = z.infer<typeof CreateRoleBodySchema>
export type GetRoleParamsType = z.infer<typeof GetRoleParamsSchema>
export type UpdateRoleBodyType = z.infer<typeof UpdateRoleBodyShema>
export type GetRoleQueryType = z.infer<typeof GetRoleQuerySchema>
export type GetRolesResType = z.infer<typeof GetRolesResSchema>