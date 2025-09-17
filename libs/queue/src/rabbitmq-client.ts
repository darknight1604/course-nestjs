import { Injectable, Logger } from '@nestjs/common';
import * as rabbit from 'rabbitmq-stream-js-client';
import { ConsumerFunc } from 'rabbitmq-stream-js-client/dist/consumer';

@Injectable()
export class RabbitMQClient {
  private client: rabbit.Client | undefined;
  private readonly logger = new Logger(RabbitMQClient.name);
  private streamSizeRetention = 5 * 1e9;
  private createStreamAguments = {
    'max-length-bytes': this.streamSizeRetention,
  };

  async initialize(params: rabbit.ClientParams) {
    if (this.client) {
      this.logger.log('RabbitMQ client already initialized');
      return;
    }

    this.client = await rabbit.connect(params);
    this.logger.log('RabbitMQ client initialized');
  }

  async createPublisher(streamName: string) {
    if (!this.client) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    await this.client.createStream({
      stream: streamName,
      arguments: this.createStreamAguments,
    });
    const publisher = await this.client.declarePublisher({
      stream: streamName,
    });
    this.logger.log(`Publisher created for stream: ${streamName}`);

    return publisher;
  }

  async createConsumer(streamName: string, handle: ConsumerFunc) {
    if (!this.client) {
      throw new Error('Client not initialized. Call initialize() first.');
    }
    await this.client.createStream({
      stream: streamName,
      arguments: this.createStreamAguments,
    });
    const consumer = await this.client.declareConsumer(
      { stream: streamName, offset: rabbit.Offset.next() },
      handle,
    );
    this.logger.log(`Consumer created for stream: ${streamName}`);

    return consumer;
  }
}
