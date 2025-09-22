
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod'
import { GetUserProfileResShema, UpdateProfileResSchema } from '../models/share-user.model';


// dùng cho /Get profile và users/:id
export class GetUserProfileResDTO extends createZodDto(GetUserProfileResShema) {}

// dùng cho put('profile') và put('/users/:id')
export class UpdateProfileResDTO extends createZodDto(UpdateProfileResSchema) {}