import { UnauthorizedException } from "@nestjs/common";

export const UserAlreadyExistsException = new UnauthorizedException({
    message: 'ERROR.USER_ALREADY_EXISTS',
    path: 'email'
})

export const CannotUpdateAdminUserException = new UnauthorizedException({
    message: 'ERROR.CANNOT_UPDATE_ADMIN_USER',
    path: 'id'
}) // Neu muon cap nhat thi goi api cap nhat profile

export const CannotDeleteAdminUserException = new UnauthorizedException({
    message: 'ERROR.CANNOT_DELETE_ADMIN_USER',
    path: 'id'
})

export const CannotSetAdminRoleToUserException = new UnauthorizedException({
    message: 'ERROR.CANNOT_SET_ADMIN_ROLE_TO_USER',
    path: 'roleId'
})

export const RoleNotFoundException = new UnauthorizedException({
    message: 'ERROR.ROLE_NOT_FOUND',
    path: 'roleId'
})

export const CannotUpdateOrDeleteYourselfException = new UnauthorizedException({
    message: 'ERROR.CANNOT_UPDATE_OR_DELETE_YOURSELF',
    path: 'id'
})