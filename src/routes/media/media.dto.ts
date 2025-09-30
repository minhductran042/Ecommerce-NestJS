import {z} from 'zod'

export const PresignUploadFileBodySchema = z.object({
    fileName: z.string(),
    fileSize: z.number()
})

export const uploadFileResSchema = z.object({
    data: z.array(z.object({
        url: z.string()
    }))
})

export const PresignUploadResSchema = z.object({    
    presignedUrl: z.string(),
    url: z.string()
})

export type PresignUploadFileBodyType = z.infer<typeof PresignUploadFileBodySchema>