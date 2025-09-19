import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleBodyDTO, GetRoleDetailDTO, GetRoleParamsDTO, GetRoleQueryBodyDTO, GetRolesResDTO, RoleWithPermissionsDTO, UpdateRoleBodyDTO } from './role.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { parametermanager } from 'googleapis/build/src/apis/parametermanager';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    @ZodSerializerDto(GetRolesResDTO)
    list(@Query() query: GetRoleQueryBodyDTO) {
        return this.roleService.list({
            limit: query.limit,
            page: query.page
        })
    }

    @Get(':roleId')
    @ZodSerializerDto(RoleWithPermissionsDTO)
    findById(@Param() param: GetRoleParamsDTO) {
        return this.roleService.getById(param.roleId)
    }

    @Post()
    @ZodSerializerDto(GetRoleDetailDTO) 
    create(@Body() body: CreateRoleBodyDTO, @ActiveUser('userId') createdById: number) {
        return this.roleService.create(body, createdById)
    }

    @Put(':roleId')
    @ZodSerializerDto(RoleWithPermissionsDTO)
    update(@Param() param: GetRoleParamsDTO,@Body() body: UpdateRoleBodyDTO, @ActiveUser('userId') updatedById: number) {
        return this.roleService.update({
            roleId: param.roleId,
            data: body,
            updatedById
        })
    } 

    @Delete(':roleId')
    @ZodSerializerDto(MessageResDTO)
    delete(@Param() param: GetRoleParamsDTO) {
        return this.roleService.delete(param.roleId)
    }

}
