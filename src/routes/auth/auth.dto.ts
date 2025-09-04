import { UserStatus } from '@prisma/client'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import de from 'zod/v4/locales/de.js'

const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  avatar: z.string().nullable(),
  status: z.nativeEnum(UserStatus),
  roleId: z.number(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
}).strict() // neu o day co strict thi se bi loi vi khong co nhung field co trong object vao

const RegisterBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  name: z.string().min(1).max(100),
  confirmPassword: z.string().min(6).max(100),
  phoneNumber: z.string().min(10).max(15),
}).strict().superRefine(({confirmPassword, password}, ctx )=> {
    if(password !== confirmPassword) {
        ctx.addIssue({ 
          code: 'custom',
          message: 'Password and confirm password do not match',
          path: ['confirmPassword']
        })
    }
}) // strict: 

export class RegisterResponseDTO extends createZodDto(UserSchema) {}

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}
