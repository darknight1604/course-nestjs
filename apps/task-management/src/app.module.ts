import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from '@task-management/middlewares/logger.middleware';
import { AuthModule } from '@task-management/modules/authentication/auth.module';
import { UsersModule } from '@task-management/modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from './modules/teams/teams.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { CommentsModule } from './modules/comments/comments.module';
import configuration from '@task-management/core/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => configuration().database,
    }),
    UsersModule,
    AuthModule,
    TeamsModule,
    SessionsModule,
    TicketsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Apply LoggerMiddleware to all routes
  }
}
