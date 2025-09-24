import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from 'src/shared/shared.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor} from 'nestjs-zod';
import { AuthModule } from './routes/auth/auth.module';
import MyZodValidationPipe from './shared/pipes/custom-zod-validation.pipe';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LanguageModule } from './routes/language/language.module';
import { PermissionModule } from './routes/permission/permission.module';
import { RoleModule } from './routes/role/role.module';
import { ProfileModule } from './routes/profile/profile.module';
import { UserModule } from './routes/user/user.module';

@Module({
  imports: [
    SharedModule,
    AuthModule, 
    LanguageModule, 
    PermissionModule, 
    RoleModule, 
    ProfileModule, 
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService , 
    {
      provide: APP_PIPE,
      useClass: MyZodValidationPipe,
    },
    { 
      provide: APP_INTERCEPTOR, 
      useClass: ZodSerializerInterceptor 
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }
  ],
})
export class AppModule {}
