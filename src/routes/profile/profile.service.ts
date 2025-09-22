import { Injectable } from '@nestjs/common';
import { InvalidPasswordException, NotFoundRecordException } from 'src/shared/error';
import { ShareUserRepository } from 'src/shared/repository/share-user.repo';
import { ChangePasswordBodyType, UpdateMeBodyType } from './profile.model';
import { isUniqueConstraintPrismaError } from 'src/shared/helper';
import { HashingService } from 'src/shared/services/hashing.service';

@Injectable()
export class ProfileService {
    constructor(
        private readonly shareUserRepository: ShareUserRepository,
        private readonly hashingService: HashingService
    ) {}

    async getProfile(userId: number) {
        const user = await this.shareUserRepository.findUniqueIncludeRolePermissions({
            id: userId,
            deletedAt: null
        })
        // console.log(user)

        if(!user) {
            throw NotFoundRecordException
        }

        return user
    }

    async updateProfile({
        userId,
        data
    }: {
        userId: number,
        data: UpdateMeBodyType
    }) {

        try {

            const user = await this.shareUserRepository.findUnique({
                id: userId,
                deletedAt: null
            })

            if(!user) {
                throw NotFoundRecordException
            }

            return await this.shareUserRepository.update(
            {
                id: userId,
                deletedAt: null
            },
            {
                ...data,
                updatedById: userId
            }
        )
        } catch(error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw NotFoundRecordException
            }
            throw error
        }
        
    } 

    async changePassword({
        userId,
        data
    }: {
        userId: number,
        data: ChangePasswordBodyType
    }) {
        try {
            const {password, newPassword} = data
            const user = await this.shareUserRepository.findUnique({
                id: userId,
                deletedAt: null
            })

            if(!user) {
                throw NotFoundRecordException
            }

            const isPasswordMatch = await this.hashingService.compare(password, user.password)
            if(!isPasswordMatch) {
                throw InvalidPasswordException
            }

            const hashedPassword = await this.hashingService.hash(data.newPassword)
            await this.shareUserRepository.update(
                {
                    id: userId,
                    deletedAt: null
                },
                {
                    password: hashedPassword,
                    updatedById: userId
                }
            )
            return "Change password successfully"
        }

        catch(error) {
            if(isUniqueConstraintPrismaError(error)) {
                throw NotFoundRecordException
            }
            throw error
        }
    }
}
