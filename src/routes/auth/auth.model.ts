import { TypeOfVerificationCode, UserStatus } from "src/shared/constants/auth.constant";
import z from "zod";
import { UserSchema } from "src/shared/models/share-user.model";


//==================================================
export const RegisterBodySchema = UserSchema.pick({ // Chỉ lấy các trường cần thiết cho đăng ký
    email: true,
    name: true,
    password: true,
    phoneNumber: true,
}).extend({
    confirmPassword: z.string().min(6).max(100), // Thêm trường confirmPassword
    code: z.string().length(6), // Thêm trường code
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


//==================================================
export const RegisterResSchema = UserSchema.omit({
    password: true,
    totpSecret: true,
})

export type RegisterResType = z.infer<typeof RegisterResSchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng



//==================================================
export const VerificationCodeSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    code: z.string().length(6),
    type : z.enum([TypeOfVerificationCode.FORGOT_PASSWORD, TypeOfVerificationCode.REGISTER]),
    expiresAt: z.coerce.date(),
    createdAt: z.coerce.date(),
})

export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng


//==================================================

export const sendOTPBodySchema = VerificationCodeSchema.pick({
    email: true,
    type: true
})

export type SendOTPBodyType = z.infer<typeof sendOTPBodySchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng