import { Global, Logger, Module, OnModuleInit } from '@nestjs/common';
import { QueueService } from './queue.service';
import { RabbitMQClient } from './rabbitmq-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [QueueService, RabbitMQClient],
  exports: [QueueService, RabbitMQClient],
})
export class QueueModule implements OnModuleInit {
  private readonly logger = new Logger(QueueModule.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly rabbitMQClient: RabbitMQClient,
  ) {}

  async onModuleInit() {
    try {
      await this.rabbitMQClient.initialize({
        hostname: this.configService.get<string>('RABBITMQ_HOST', 'localhost'),
        port: this.configService.get<number>('RABBITMQ_PORT', 5552),
        username: this.configService.get<string>('RABBITMQ_USER', 'guest'),
        password: this.configService.get<string>('RABBITMQ_PASS', 'guest'),
        vhost: this.configService.get<string>('RABBITMQ_VHOST', '/'),
      });
    } catch (error) {
      this.logger.error('Error initializing RabbitMQ client:', error);
    }
  }
}
