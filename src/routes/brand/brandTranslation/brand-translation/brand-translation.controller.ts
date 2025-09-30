import { Controller, Param , Get, Post, Body, Put, Delete} from '@nestjs/common';
import { BrandTranslationService } from './brand-translation.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateBrandTranslationBodyDTO, GetBrandTranslationDetailDTO, GetBrandTranslationParamsDTO, UpdateBrandTranslationBodyDTO } from './brand-translation.dto';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('brand-translation')
export class BrandTranslationController {

    constructor(
        private readonly brandTranslationService: BrandTranslationService
    ) {}

    @Get(':id')
    @ZodSerializerDto(GetBrandTranslationDetailDTO)
    findById(@Param() param: GetBrandTranslationParamsDTO) {
        return this.brandTranslationService.findById(param.id)
    }

    @Post()
    @ZodSerializerDto(GetBrandTranslationDetailDTO)
    create(@Body() body: CreateBrandTranslationBodyDTO, @ActiveUser('userId') createdById: number) {
        return this.brandTranslationService.create({
            data: body,
            createdById
        })
    }

    @Put(':id')
    @ZodSerializerDto(GetBrandTranslationDetailDTO)
    update(@Param() param: GetBrandTranslationParamsDTO, @Body() body: UpdateBrandTranslationBodyDTO, @ActiveUser('userId') updatedById: number) {
        return this.brandTranslationService.update({
            id: param.id,
            data: body,
            updatedById
        })
    }

    @Delete(':id')
    @ZodSerializerDto(MessageResDTO)
    delete(@Param() param: GetBrandTranslationParamsDTO) {
        return this.brandTranslationService.delete(param.id)
    }
}
