import z from "zod"
import { UserStatus } from "src/shared/constants/auth.constant";
import { RoleShema } from "./shared-role.model";
import { PermissionSchema } from "../models/shared-permission.model";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(6).max(100),
  phoneNumber: z.string().min(9).max(15),
  avatar: z.string().nullable(),
  totpSecret: z.string().length(6).nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
  roleId: z.number().positive(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})


export const GetUserProfileResShema = UserSchema.omit({
  password: true,
  totpSecret: true,
}).extend({
  role: RoleShema.pick({
    id: true,
    name: true
  }).extend({
  permissions: z.array(PermissionSchema.pick({
    id: true,
    name: true,
    module: true,
    path: true,
    method: true
  }))
})
})

export const UpdateProfileResSchema = UserSchema.omit({
  password: true,
  totpSecret: true
})



export type UserType = z.infer<typeof UserSchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng
export type GetUserProfileResType = z.infer<typeof GetUserProfileResShema>
export type UpdateProfileResType = z.infer<typeof UpdateProfileResSchema>