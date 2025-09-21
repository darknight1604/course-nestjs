import { QueueModule } from '@foundation/queue';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@notification-app/core/config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from '@notification-app/modules/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    QueueModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
