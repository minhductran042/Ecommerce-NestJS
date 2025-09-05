import { UserStatus } from "src/shared/constants/auth.constant";
import z from "zod";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(6).max(100),
  phoneNumber: z.string().min(9).max(15),
  avatar: z.string().nullable(),
  totpSecret: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
  roleId: z.number().positive(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserType = z.infer<typeof UserSchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng

export const RegisterBodySchema = UserSchema.pick({ // Chỉ lấy các trường cần thiết cho đăng ký
    email: true,
    name: true,
    password: true,
    phoneNumber: true,
}).extend({
    confirmPassword: z.string().min(6).max(100), // Thêm trường confirmPassword
}).strict().superRefine(({confirmPassword, password}, ctx )=> {
    if(password !== confirmPassword) {
        ctx.addIssue({ 
          code: 'custom',
          message: 'Password and confirm password do not match',
          path: ['confirmPassword']
        })
    }
}) // strict: 

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng


export const RegisterResSchema = UserSchema.omit({
    password: true,
    totpSecret: true,
})

export type RegisterResType = z.infer<typeof RegisterResSchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng