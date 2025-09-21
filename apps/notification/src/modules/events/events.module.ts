import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsController } from './events.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
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
  ],
  controllers: [EventsController],
  providers: [EventsGateway],
})
export class EventsModule {}
