import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ZodSerializationException, ZodSerializerDto } from 'nestjs-zod';
import { CreatePermissionBodyDTO, GetPermissionDetailDTO, GetPermissionParamsDTO, GetPermissionQueryDTO, GetPermissionsResDTO } from './permission.dto';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';
import { GetPermissionDetailSchema } from './permission.model';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('permissions')
export class PermissionController {
    constructor(private permissionService: PermissionService) {}

    @Get()
    @ZodSerializerDto(GetPermissionsResDTO)
    list(@Query() query: GetPermissionQueryDTO) {
        return this.permissionService.list({
            page: query.page,
            limit: query.limit
        })
    }

    @Get(':permissionId')
    @ZodSerializerDto(GetPermissionDetailDTO)
    findById(@Param() permissionId: GetPermissionParamsDTO) {
        return this.permissionService.findById(permissionId.permissionId)
    }

    @Post()
    @ZodSerializerDto(GetPermissionDetailDTO)
    create(@Body() data: CreatePermissionBodyDTO, @ActiveUser('userId') createdById: number) {
        return this.permissionService.create({
            data, 
            createdById
        })
    }

    @Put(':permissionId')
    @ZodSerializerDto(GetPermissionDetailDTO) 
    update(
        @Param() permissionId: GetPermissionParamsDTO,
        @Body() data: CreatePermissionBodyDTO,
        @ActiveUser('userId') updatedById: number
    ) 
    {
        return this.permissionService.update({
            permissionId: permissionId.permissionId,
            data, 
            updatedById
        })
    }

    @Delete(':permissionId')
    @ZodSerializerDto(MessageResDTO)
    delete(@Param() permissionId : GetPermissionParamsDTO) {
        return this.permissionService.delete(permissionId.permissionId)
    }

}
