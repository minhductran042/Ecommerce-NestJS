import { ForbiddenException, UnprocessableEntityException } from "@nestjs/common"

export const RoleHasAlreadyExistsError = new UnprocessableEntityException({
    message: 'ERROR.ROLE_HAS_ALREADY_EXISTS',
    path: 'name'    
})


export const ProhibitedActionOnBaseRoleException = new ForbiddenException({
    message: 'ERROR.PROHIBITED_ACTION_ON_BASE_ROLE'
})