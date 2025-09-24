
import { AccessTokenPayload } from "../types/jwt.type";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_ROLE_PERMISSIONS, REQUEST_USER_KEY } from "../constants/auth.constant";
import { RoleWithPermissionsType } from "../models/shared-role.model";

export const ActiveRolePermissions = createParamDecorator((field: keyof RoleWithPermissionsType | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const rolePermissions: RoleWithPermissionsType | undefined = request[REQUEST_ROLE_PERMISSIONS];
    
    if (!rolePermissions) {
        throw new Error(`User not authenticated. Field '${field}' not available.`);
    }

    if (rolePermissions instanceof Promise) {
        return rolePermissions.then(resolvedRole => field ? resolvedRole[field] : resolvedRole);
    }
    
    return field ? rolePermissions[field] : rolePermissions;
}) 