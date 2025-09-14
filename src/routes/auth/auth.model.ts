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


//==================================================
export const RegisterResSchema = UserSchema.omit({
    password: true,
    totpSecret: true,
})




//==================================================
export const VerificationCodeSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    code: z.string().length(6),
    type : z.enum([
        TypeOfVerificationCode.FORGOT_PASSWORD, 
        TypeOfVerificationCode.REGISTER, 
        TypeOfVerificationCode.DISABLE_2FA, 
        TypeOfVerificationCode.LOGIN
    ]),
    expiresAt: z.coerce.date(),
    createdAt: z.coerce.date(),
})



//==================================================

export const sendOTPBodySchema = VerificationCodeSchema.pick({
    email: true,
    type: true
})




export const loginBodySchema = UserSchema.pick({
    email: true,
    password: true,
}).extend({
    totpCode: z.string().length(6).optional(), //2FA code
    code: z.string().length(6).optional() //OTP code
}).strict().superRefine(({code, totpCode}, ctx) => {
    if(code !== undefined && totpCode !== undefined) {
        const message = 'You can not provide both otp code and 2FA code'
        ctx.addIssue({
            code: 'custom',
            message,
            paht: ['code']
        })

        ctx.addIssue({
            code: 'custom',
            message,
            paht: ['totpCode']
        })
    }
})


export const LoginResShema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
})


export const RefreshTokenBodySchema = z.object({
    refreshToken: z.string(),
}).strict()



export const RefreshTokenResSchema = LoginResShema


//==================================================
export const DeviceSchema = z.object({
    id: z.number(),
    userId: z.number(),
    userAgent: z.string(),
    ip: z.string(),
    lastActive: z.date(),
    createdAt: z.date(),
    isActive: z.boolean()
})



export const RoleSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive: z.boolean(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const RefreshTokenSchema = z.object({
    token: z.string(),
    userId: z.number(),
    deviceId: z.number(),
    expiresAt: z.coerce.date(),
    createdAt: z.coerce.date(),
})


export const logoutBodySchema = RefreshTokenBodySchema

export const GoogleAuthStateSchema = DeviceSchema.pick({
    userAgent: true, 
    ip: true
})

export const getAuthorizationUrlResSchema = z.object({
    url: z.string().url()
})


//==========================================


export const ForgotPasswordBodySchema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
    newPassword: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
}).strict()
.superRefine(({confirmPassword, newPassword}, ctx) => { 
    if(newPassword != confirmPassword) {
        ctx.addIssue({
            code: 'custom',
            message: 'New password and confirm password do not match',
            path: ['confirmPassword']
        })
    }
})


export const DisableTwoFactorBodySchema = z.object({
    totpCode: z.string().length(6).optional(), // 2FA code
    code: z.string().length(6).optional() // otp code
}).strict().superRefine(({code, totpCode}, ctx) => {
    const message =  'You can not provide both otp code and 2FA code'
    //Điều kiện nếu cả 2 không có hoặc cả 2 đều có
    if( (code !== undefined) ===  (totpCode !== undefined)) {
        ctx.addIssue({
            code: 'custom',
            message,
            path: ['totp'],
        })
        ctx.addIssue({
            code: 'custom',
            message,
            path: ['code'],
        
        })
    }
})


export const TwoFactorSetupSchema = z.object({
    secret: z.string(),
    uri: z.string()
})


export type RegisterBodyType = z.infer<typeof RegisterBodySchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng
export type RegisterResType = z.infer<typeof RegisterResSchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng
export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng
export type SendOTPBodyType = z.infer<typeof sendOTPBodySchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng
export type LoginBodyType = z.infer<typeof loginBodySchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng
export type LoginResType = z.infer<typeof LoginResShema>; // Sử dụng kiểu này trong các phần khác của ứng dụng
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng
export type RefreshTokenResType = LoginResType
export type DeviceType = z.infer<typeof DeviceSchema>;
export type RoleType = z.infer<typeof RoleSchema>;
export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>
export type logoutBodyType = RefreshTokenBodyType
export type GoogleAuthStateType = z.infer<typeof GoogleAuthStateSchema>
export type getAuthorizationUrlType = z.infer<typeof getAuthorizationUrlResSchema>
export type ForgotPasswordType = z.infer<typeof ForgotPasswordBodySchema>
export type DisableTwoFactorBodyType = z.infer<typeof DisableTwoFactorBodySchema>
export type TwoFactorSetupResType = z.infer<typeof TwoFactorSetupSchema>