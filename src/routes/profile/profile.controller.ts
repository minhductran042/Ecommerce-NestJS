import { Body, Controller, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Get } from '@nestjs/common';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';
import { ChangePasswordBodyDTO, UpdateMeBodyDTO } from './profile.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { GetUserProfileResDTO, UpdateProfileResDTO } from 'src/shared/dtos/share-user.dto';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    @ZodSerializerDto(GetUserProfileResDTO)
    getProfile(@ActiveUser('userId') userId: number) {
        return this.profileService.getProfile(userId)
    }

    @Put()
    @ZodSerializerDto(UpdateProfileResDTO)
    updateProfile(@ActiveUser('userId') userId: number, @Body() body: UpdateMeBodyDTO) {
        console.log("chay vao day")
        return this.profileService.updateProfile({
            userId,
            data: body
        })
    }

    @Put('change-password')
    @ZodSerializerDto(MessageResDTO)
    changePassword(@ActiveUser('userId') userId: number, @Body() body: ChangePasswordBodyDTO) {
        return this.profileService.changePassword({
            userId,
            data: body
        })
    }
}
