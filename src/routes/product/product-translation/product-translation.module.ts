import { Module } from '@nestjs/common';
import { ProductTranslationService } from './product-translation.service';
import { ProductTranslationController } from './product-translation.controller';
import { ProductTranslationRepository } from './product-translation.repo';

@Module({
  providers: [ProductTranslationService, ProductTranslationRepository],
  controllers: [ProductTranslationController]
})
export class ProductTranslationModule {}
