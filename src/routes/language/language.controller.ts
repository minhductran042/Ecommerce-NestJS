import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { LanguageService } from './language.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateLanguageBodyDTO, GetLanguageDetailDTO, GetLanguageParamsDTO, GetLanguagesResDTO, UpdateLanguageBodyDTO } from './language.dto';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('languages')
export class LanguageController {
    constructor(private readonly languageService: LanguageService) {}

    @Get()
    @ZodSerializerDto(GetLanguagesResDTO)
    findAll() {
        return this.languageService.findAll()
    }

    @Get(':languageId')
    @ZodSerializerDto(GetLanguageDetailDTO)
    findById(@Param() params: GetLanguageParamsDTO) {
        return this.languageService.findById(params.languageId)
    }

    @Post()
    @ZodSerializerDto(GetLanguageDetailDTO)
    create(@Body() body: CreateLanguageBodyDTO, @ActiveUser('userId') userId: number) {
        return this.languageService.create({
            data: body,
            createdById: userId
        })
    }

    @Put(':languageId')
    @ZodSerializerDto(GetLanguageDetailDTO)
    update(@Param() params : GetLanguageParamsDTO, @ActiveUser('userId') userId: number, @Body() body: UpdateLanguageBodyDTO) {
        return this.languageService.update({
            languageId: params.languageId,
            updatedById: userId,
            data: body
        })
    }

    @Delete(':languageId')
    @ZodSerializerDto(MessageResDTO)
    delete(@Param() params: GetLanguageParamsDTO) {
        return this.languageService.delete(params.languageId)
    }

    

}
