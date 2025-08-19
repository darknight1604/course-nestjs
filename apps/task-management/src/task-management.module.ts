import { Module } from '@nestjs/common';
import { TaskManagementController } from './task-management.controller';
import { TaskManagementService } from './task-management.service';
import { UsersModule } from './features/authentication/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [TaskManagementController],
  providers: [TaskManagementService],
})
export class TaskManagementModule {}
