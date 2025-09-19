import { UnprocessableEntityException } from "@nestjs/common"

export const RoleHasAlreadyExistsError = new UnprocessableEntityException({
    message: 'ERROR.ROLE_HAS_ALREADY_EXISTS',
    path: 'id'    
})