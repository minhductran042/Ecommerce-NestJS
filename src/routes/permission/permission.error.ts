import { UnprocessableEntityException } from "@nestjs/common"

export const PermissionHasAlreadyExistsError = new UnprocessableEntityException([
    {
     message: 'ERROR.PERMISSION_HAS_ALREADY_EXISTS',
     path: 'path'
    },  
    {
        message: 'ERROR.PERMISSION_HAS_ALREADY_EXISTS',
        path: 'method'
    }
])
   
