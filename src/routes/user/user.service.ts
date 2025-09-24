import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repo';
import { CreateUserBodyType, GetUserParamType, GetUserQueryType, UpdateUserBodyType } from './user.model';
import { ShareUserRepository } from 'src/shared/repository/share-user.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { RoleName } from 'src/shared/constants/role.constant';
import { ShareRoleRepository } from 'src/shared/repository/share-role.repo';
import { HashingService } from 'src/shared/services/hashing.service';
import { isForeignKeyConstraintPrismaError, isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { CannotUpdateOrDeleteYourselfException, RoleNotFoundException, UserAlreadyExistsException } from './user.error';


@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly shareUserRepository: ShareUserRepository,
        private readonly shareRoleRepository: ShareRoleRepository,
        private readonly hashingService: HashingService
    ) {}

    list(pagination: GetUserQueryType) {
        return this.userRepository.list(pagination)
    }

    async findById(userId: number) {
        const user = await this.shareUserRepository.findUniqueIncludeRolePermissions({
            id: userId,
            deletedAt: null
        })

        if(!user) {
            throw NotFoundRecordException
        }

        return user
    }

    async create({
        data,
        createdById,
        createdByRoleName
    } : {
        data: CreateUserBodyType,
        createdById: number,
        createdByRoleName: string
    }) {
        try {
            //Chi co admin moi co quyen tao user voi role la admin
            await this.verifyRole({
                roleNameAgent: createdByRoleName,
                roleIdTarget: data.roleId
            });

            const hashPassword = await this.hashingService.hash(data.password)
            const user =  await this.userRepository.create({
                createdById,
                data: {
                    ...data,
                    password: hashPassword,
                },
            })         
            return user             
        } catch(error) {
            if(isForeignKeyConstraintPrismaError(error)) {
                throw RoleNotFoundException
            }
        }
    }

    async update({
        userId,
        data, 
        updatedById,
        updatedByRoleName
    } : {
        userId: number,
        data: UpdateUserBodyType,
        updatedById: number,
        updatedByRoleName: string
    }) {
        try {   

            // Không thể cập nhật chính mình
            if(userId === updatedById) {
                throw CannotUpdateOrDeleteYourselfException
            }

            const currentUser = await this.shareUserRepository.findUnique({
                id: userId,
                deletedAt: null
            })

            if(!currentUser) {
                throw NotFoundRecordException
            }

            const roleIdTartGet = currentUser.roleId
            //
            await this.verifyRole({
                roleNameAgent: updatedByRoleName,
                roleIdTarget: roleIdTartGet
            })

            const hashPassword = await this.hashingService.hash(data.password)
            const user = await this.shareUserRepository.update({
                id: userId,
                deletedAt: null
            }, {
                ...data,
                password: hashPassword,
                updatedById
            })
            return user


        } catch(error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException
            }
            if(isUniqueConstraintPrismaError(error)) {
                throw UserAlreadyExistsException
            }
            if(isForeignKeyConstraintPrismaError(error)) {
                throw RoleNotFoundException
            }
            throw error
        }
    }

    async delete(userId: number, deletedByRoleName: string) {
        try {

            const user = await this.shareUserRepository.findUnique({
                id: userId,
                deletedAt: null
            })

            if(!user) {
                throw NotFoundRecordException
            }



            await this.verifyRole({
                roleNameAgent: deletedByRoleName,
                roleIdTarget: user.id
            })

            await this.userRepository.delete(userId)
            return {
                message: 'Delete user successfully'
            }
        } catch(error) {
            if(isNotFoundPrismaError(error)) {
                throw NotFoundRecordException
            }
            throw error;
        }
    }

    //Chi co quyen la admin moi duoc: Tao admin, nang cap role khac len thanh admin, xoa admin
    // Neu khong phai thi khong duoc dong vao admin
    private async verifyRole({roleNameAgent, roleIdTarget} // Kiem tra quyen co tac dong den nguoi khac khong
) {
        // La admin thi cho phep
        if(roleNameAgent === RoleName.ADMIN) {
            return true
        } else {
            // Neu khong la admin thi roleIdTarget phai khac admin
            const adminRoleId = await this.shareRoleRepository.getAdminRoleId()
            if(roleIdTarget === adminRoleId) {
                throw new ForbiddenException()
            }
        }
        return true;
    }
}
