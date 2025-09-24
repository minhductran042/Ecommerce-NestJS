import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateUserBodyDTO, CreateUserResDTO, GetUserParamsDTO, GetUserQueryDTO, GetUsersResDTO, UpdateUserBodyDTO } from './user.dto';
import { GetUserProfileResDTO } from 'src/shared/dtos/share-user.dto';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';
import { ActiveRolePermissions } from 'src/shared/decorator/active-role-permissions.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { IsPublic } from 'src/shared/decorator/isPublic.decorator';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    @ZodSerializerDto(GetUsersResDTO)
    list(@Query() query: GetUserQueryDTO) {
        return this.userService.list({
            page: query.page,
            limit: query.limit
        })
    }

    @Get(':userId')
    @ZodSerializerDto(GetUserProfileResDTO)
    findById(@Param() param: GetUserParamsDTO) {
        return this.userService.findById(param.userId)
    }

    @Post()
    @ZodSerializerDto(CreateUserResDTO)
    create(@Body() body: CreateUserBodyDTO, 
        @ActiveUser('userId') createdById: number,
        @ActiveRolePermissions('name') createdByRoleName: string
    ) {
        return this.userService.create({
            data: body,
            createdById,
            createdByRoleName
        })
    }

    @Put(':userId')
    @ZodSerializerDto(GetUserProfileResDTO)
    update(
        @Param() param: GetUserParamsDTO,
        @Body() body: UpdateUserBodyDTO,
        @ActiveUser('userId') updatedById: number,
        @ActiveRolePermissions('name') updatedByRoleName: string
    ) {
        return this.userService.update({
            userId: param.userId,
            data: body,
            updatedById,
            updatedByRoleName
        })
    }

    @Delete()
    @ZodSerializerDto(MessageResDTO)
    delete(@Param() param: GetUserParamsDTO, 
        @ActiveRolePermissions('name') deletedByRoleName: string
    ) {
        return this.userService.delete(param.userId, deletedByRoleName)
    }

}
