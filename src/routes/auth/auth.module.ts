import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RoleService } from './role.service';
import { SharedModule } from 'src/shared/shared.module';
import { AuthRepository } from './auth.repo';
import { GoogleService } from './google.service';

@Module({
  imports: [SharedModule],
  providers: [AuthService, RoleService, AuthRepository, GoogleService],
  controllers: [AuthController]
})
export class AuthModule {}
