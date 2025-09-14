import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionsModule } from '@task-management/modules/sessions/sessions.module';
import { QueueModule } from '@foundation/queue';
import { RabbitMQClient } from '@foundation/queue/rabbitmq-client';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
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
    QueueModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule implements OnModuleInit {
  private readonly logger = new Logger(TicketsModule.name);
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly rabbitMQClient: RabbitMQClient,
  ) {}

  onModuleInit() {
    this.rabbitMQClient.createConsumer('tickets_queue', async (message) => {
      await this.ticketsService.create(
        JSON.parse(message.content.toString() as string) as CreateTicketDto,
      );
      this.logger.log('Ticket created from queue message');
    });
  }
}
