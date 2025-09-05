import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RoleService } from './role.service';
import { SharedModule } from 'src/shared/shared.module';
import { AuthRepository } from './auth.repo';

@Module({
  imports: [SharedModule],
  providers: [AuthService, RoleService, AuthRepository],
  controllers: [AuthController]
})
export class AuthModule {}
