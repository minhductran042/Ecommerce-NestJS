import { HTTPMethod } from "@prisma/client";
import z from "zod";

export const PermissionSchema = z.object({
    id: z.number(),
    name: z.string().max(500),
    description: z.string(),
    path: z.string().max(1000),
    method: z.enum([
        HTTPMethod.GET,
        HTTPMethod.POST,
        HTTPMethod.PUT,
        HTTPMethod.DELETE,
        HTTPMethod.PATCH,
        HTTPMethod.HEAD,
        HTTPMethod.OPTIONS
    ]),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const GetPermissionsResSchema = z.object({
    data: z.array(PermissionSchema),
    totalItems: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number()
})

export const GetPermissionQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10) // pageSize, coerce để ép kiểu từ string sang number, positve để chỉ nhận số dương
}).strict()

export const GetPermissionDetailSchema = PermissionSchema

export const GetPermissionParamsSchema = z.object({
    permissionId: z.coerce.number()
})

export const CreatePermissionBodyShema = PermissionSchema.pick({
    name: true, 
    path: true,
    method: true
}).strict()

export const UpdatePermissionBodySchema = CreatePermissionBodyShema

export type PermissionType = z.infer<typeof PermissionSchema>
export type GetPermissionDetailType = z.infer<typeof GetPermissionDetailSchema>
export type GetPermissionsResType = z.infer<typeof GetPermissionsResSchema>
export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodyShema>
export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>
export type GetPermissionQueryType = z.infer<typeof GetPermissionQuerySchema>

