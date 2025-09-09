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


export const loginBodySchema = UserSchema.pick({
    email: true,
    password: true,
}).strict() // strict : không cho phép các trường ngoài email và password nghĩa là nếu gửi thêm các trường khác sẽ báo lỗi

export type LoginBodyType = z.infer<typeof loginBodySchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng


export const LoginResShema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
})


export type LoginResType = z.infer<typeof LoginResShema>; // Sử dụng kiểu này trong các phần khác của ứng dụng


export const RefreshTokenBodySchema = z.object({
    refreshToken: z.string(),
}).strict()

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>; // Sử dụng kiểu này trong các phần khác của ứng dụng

export const RefreshTokenResSchema = LoginResShema

export type RefreshTokenResType = LoginResType


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

export type DeviceType = z.infer<typeof DeviceSchema>;


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

export type RoleType = z.infer<typeof RoleSchema>;