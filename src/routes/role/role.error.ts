import { ForbiddenException, UnprocessableEntityException } from "@nestjs/common"

export const RoleHasAlreadyExistsError = new UnprocessableEntityException({
    message: 'ERROR.ROLE_HAS_ALREADY_EXISTS',
    path: 'name'    
})

export const ProhibitActionOnRole = new ForbiddenException({
    message: 'ERROR.PROHIBIT_ACTION_ON_ROLE'
})