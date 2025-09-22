
import { UserSchema } from 'src/shared/models/share-user.model'
import {z} from 'zod'

export const UpdateMeBodySchema = UserSchema.pick({
    name: true,
    avatar: true,
    phoneNumber: true
}).strict()

export const ChangePasswordBodySchema = UserSchema.pick({
    password: true
}).extend({
    newPassword: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
}).strict().superRefine(({confirmPassword, newPassword}, ctx )=> {
    if(newPassword !== confirmPassword) {
        ctx.addIssue({ 
            code: 'custom',
            message: 'ERROR.ConfirmPasswordDoNotMatch',
            path: ['confirmPassword']
        })
    }
})




export type UpdateMeBodyType = z.infer<typeof UpdateMeBodySchema>
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>

