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


export type RoleType = z.infer<typeof RoleShema>