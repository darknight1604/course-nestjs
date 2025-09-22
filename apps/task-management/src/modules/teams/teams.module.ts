import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionsModule } from '@task-management/modules/sessions/sessions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
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
    SessionsModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
