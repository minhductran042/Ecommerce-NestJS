import { PermissionSchema } from "../models/shared-permission.model"
import {z} from 'zod'

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

export type RoleType = z.infer<typeof RoleShema>
export type RoleWithPermissionsType = z.infer<typeof RoleWithPermissionsSchema>