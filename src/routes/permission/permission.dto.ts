import { createZodDto } from "nestjs-zod";
import { CreatePermissionBodyShema, GetPermissionDetailSchema, GetPermissionParamsSchema, GetPermissionQuerySchema, GetPermissionsResSchema, UpdatePermissionBodySchema } from "./permission.model";

export class GetPermissionsResDTO extends createZodDto(GetPermissionsResSchema) {}
export class GetPermissionDetailDTO extends createZodDto(GetPermissionDetailSchema) {}
export class GetPermissionParamsDTO extends createZodDto(GetPermissionParamsSchema) {}
export class GetPermissionQueryDTO extends createZodDto(GetPermissionQuerySchema) {}
export class CreatePermissionBodyDTO extends createZodDto(CreatePermissionBodyShema) {}
export class UpdatePermissionBodyDTO extends createZodDto(UpdatePermissionBodySchema) {}