import { Module } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { SprintsController } from './sprints.controller';
import { Sprint } from './entities/sprint.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionsModule } from '@task-management/modules/sessions/sessions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sprint]),
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
  controllers: [SprintsController],
  providers: [SprintsService],
})
export class SprintsModule {}
