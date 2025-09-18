import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { SharedModule } from 'src/shared/shared.module';
import { RoleRepository } from './role.repo';

@Module({
  imports: [SharedModule],
  providers: [RoleService, RoleRepository],
  controllers: [RoleController]
})
export class RoleModule {}
