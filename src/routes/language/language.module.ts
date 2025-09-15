import { Module } from '@nestjs/common';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';
import { SharedModule } from 'src/shared/shared.module';
import { LanguageRepository } from './language.repo';

@Module({
  imports: [SharedModule],
  controllers: [LanguageController],
  providers: [LanguageService, LanguageRepository]
})
export class LanguageModule {}
