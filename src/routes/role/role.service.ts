import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repo';
import { CreateRoleBodyType, GetRoleQueryType, UpdateRoleBodyType } from './role.model';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { ProhibitActionOnRole, RoleHasAlreadyExistsError } from './role.error';
import { NotFoundRecordException } from 'src/shared/models/error.model';
import { RoleName } from 'src/shared/constants/role.constant';

@Injectable()
export class RoleService {
    constructor(private readonly roleRepo: RoleRepository) {}

    async list(pagination: GetRoleQueryType) {
        try {
            return await this.roleRepo.list(pagination)
        } catch (error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw RoleHasAlreadyExistsError
            }
            throw error
        }
    }

    async getById(roleId: number) {
        try {
            return await this.roleRepo.findById(roleId)
        }
        catch (error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw RoleHasAlreadyExistsError
            }
            throw error
        }
    }

    async create(data: CreateRoleBodyType , createdById: number) {
        try {
            return await this.roleRepo.create({
                data,
                createdById
            })
        } catch (error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw RoleHasAlreadyExistsError
            } 
            throw error
        }
    }

    async update({
        roleId,
        data,
        updatedById
    }: {
        roleId: number,
        data: UpdateRoleBodyType,
        updatedById: number
    }) {
        try {
            const role = await this.roleRepo.findById(roleId)
            if(!role) {
                throw NotFoundException
            }

             //Không được update permission cho Admin ke ca admin
            const adminRole = RoleName.ADMIN
            if(adminRole === role.name) {
                throw ProhibitActionOnRole
            }

            const updatedRole =  await this.roleRepo.update({
                roleId,
                data,
                updatedById
            })

            return updatedRole

        } catch(error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw RoleHasAlreadyExistsError
            }
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException
            }
            if(error instanceof Error) {
                throw new BadRequestException(error.message)
            }

            throw error
        }
    }

    async delete(roleId: number) {
        try {
            const role = await this.roleRepo.findById(roleId)

            if(!role) {
                throw NotFoundRecordException
            }

            //Không được xóa 3 role cơ bản này
            const baseRole : string[] = [RoleName.ADMIN && RoleName.CLIENT && RoleName.SELLER]
            if(baseRole.includes(role.name)) {
                throw ProhibitActionOnRole
            }

            await this.roleRepo.delete(roleId)
            return "Delete Role Successfully"
        } catch(error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw RoleHasAlreadyExistsError
            }
            throw error
        }
    }
    
}
