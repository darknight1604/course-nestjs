import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SessionsModule } from '@task-management/modules/sessions/sessions.module';
import { UsersModule } from '@task-management/modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    SessionsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        const expiration = config.get<string>('JWT_EXPIRATION');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return {
          global: true,
          secret: secret,
          signOptions: { expiresIn: expiration },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
