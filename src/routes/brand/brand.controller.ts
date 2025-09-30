import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandBodyDTO, GetBrandDetailDTO, GetBrandParamsDTO, GetBrandQueryDTO, GetBrandsResDTO, UpdateBrandBodyDTO } from './brand.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActiveUser } from 'src/shared/decorator/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { IsPublic } from 'src/shared/decorator/isPublic.decorator';

@Controller('brands')
export class BrandController {
    constructor(
        private readonly brandService: BrandService
    ) {}

    @Get()
    @IsPublic()
    @ZodSerializerDto(GetBrandsResDTO)
    list(@Query() query: GetBrandQueryDTO) {
        return this.brandService.list(query)
    }

    @Get(':brandId')
    @IsPublic()
    @ZodSerializerDto(GetBrandDetailDTO)
    findById(@Param() param: GetBrandParamsDTO) {
        return this.brandService.findById(param.brandId)
    }

    @Post()
    @ZodSerializerDto(GetBrandDetailDTO)
    create(@Body() body: CreateBrandBodyDTO, @ActiveUser('userId') createdById: number) {
        return this.brandService.create({
            data: body,
            createdById
        })
    }

    @Put(':brandId')
    @ZodSerializerDto(GetBrandDetailDTO)
    update(
        @Param() param: GetBrandParamsDTO,
        @Body() body: UpdateBrandBodyDTO,
        @ActiveUser('userId') updatedById: number
    ) {
        return this.brandService.update({
            brandId: param.brandId,
            data: body,
            updatedById
        })
    }

    @Delete(':brandId')
    @ZodSerializerDto(MessageResDTO)
    delete(@Param() param: GetBrandParamsDTO) {
        return this.brandService.delete(param.brandId)
    }

}
