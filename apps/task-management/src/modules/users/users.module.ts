import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { SessionsModule } from '@task-management/modules/sessions/sessions.module';
import { AuthorizationModule } from '@task-management/modules/authorization/authorization.module';
import { UsersAdminController } from './users.admin.controller';
import { UsersSuperAdminController } from './users.super-admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    SessionsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<JwtModuleOptions>('jwt');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return secret;
      },
    }),
    AuthorizationModule,
  ],
  controllers: [
    UsersController,
    UsersAdminController,
    UsersSuperAdminController,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
