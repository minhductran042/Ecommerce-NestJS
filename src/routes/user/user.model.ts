import { permission } from "process";
import { UserSchema } from "src/shared/models/share-user.model";
import { PermissionSchema } from "src/shared/models/shared-permission.model";
import { RoleShema } from "src/shared/models/shared-role.model";
import z from "zod";

export const GetUsersResSchema = z.object({
    data: z.array(UserSchema.omit({
        password: true,
        totpSecret: true
    }).extend({
        role: RoleShema.pick({
            id: true,
            name: true
        })
    })),
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
})

export const GetUserQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10)
}).strict()

export const GetUserParamsSchema = z.object({
    userId: z.coerce.number()
})

export const CreateUserBodySchema = UserSchema.pick({
    email: true,
    name: true,
    password: true,
    phoneNumber: true,
    status: true,
    avatar: true,
    roleId: true
}).strict()

export const UpdateUserBodySchema = CreateUserBodySchema

export type GetUsersResType = z.infer<typeof GetUsersResSchema>
export type GetUserQueryType = z.infer<typeof GetUserQuerySchema>
export type GetUserParamType = z.infer<typeof GetUserParamsSchema>
export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>