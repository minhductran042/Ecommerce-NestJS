import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryTranslationModule } from './category-translation/category-translation.module';
import { CategoryRepository } from './category.repo';

@Module({
  providers: [CategoryService, CategoryRepository],
  controllers: [CategoryController],
  imports: [CategoryTranslationModule]
})
export class CategoryModule {}
