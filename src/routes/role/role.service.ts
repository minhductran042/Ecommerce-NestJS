import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repo';
import { CreateRoleBodyType, GetRoleQueryType, UpdateRoleBodyType } from './role.model';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { RoleHasAlreadyExistsError, ProhibitedActionOnBaseRoleException } from './role.error';
import { NotFoundRecordException } from 'src/shared/error';
import { RoleName } from 'src/shared/constants/role.constant';

@Injectable()
export class RoleService {
    constructor(private readonly roleRepo: RoleRepository) {}

    list(pagination: GetRoleQueryType) {
        return this.roleRepo.list(pagination)
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
            // Kiểm tra base role trước khi update
            await this.verifyRole(roleId)

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
            throw error
        }
    }

    async delete(roleId: number) {
        try {
            // Kiểm tra base role trước khi delete
            await this.verifyRole(roleId)

            await this.roleRepo.delete(roleId)
            return "Delete Role Successfully"
        } catch(error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw RoleHasAlreadyExistsError
            }
            throw error
        }
    }

    private async verifyRole(roleId: number) {
        const role = await this.roleRepo.findById(roleId)
        if (!role) {
            throw NotFoundRecordException
        }
        const baseRoles: string[] = [RoleName.ADMIN, RoleName.CLIENT, RoleName.SELLER]

        if (baseRoles.includes(role.name)) {
            throw ProhibitedActionOnBaseRoleException
        }
    }
    
}
