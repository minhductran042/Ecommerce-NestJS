import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repo';
import { ProductTranslationModule } from './product-translation/product-translation.module';

@Module({
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  imports: [ProductTranslationModule]
})
export class ProductModule {}
