import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { CacheProvider } from './cache-provider.interface';

@Injectable()
export class RedisCacheProvider
  implements CacheProvider, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisCacheProvider.name);
  private client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    const username = this.configService.get('redis.username');
    const password = this.configService.get('redis.password');
    const host = this.configService.get('redis.host', 'localhost');
    const port = this.configService.get('redis.port', 6379);
    this.client = createClient({
      url:
        'redis://' +
        (username ? `${username}:${password}@` : '') +
        `${host}:${port}`,
    });
  }
  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Disconnecting Redis...');
  }
  async onModuleInit() {
    this.logger.log('Connecting to Redis...');
    await this.client.connect();
    this.logger.log('Redis connected ✅');
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const val = JSON.stringify(value);
    if (ttl) {
      await this.client.set(key, val, { EX: ttl });
    } else {
      await this.client.set(key, val);
    }

    this.logger.log(`Set cache for key: ${key}`);
  }

  async get<T>(key: string): Promise<T | null> {
    this.logger.log(`Start get cache for key: ${key}`);
    const result = await this.client.get(key);
    return result ? (JSON.parse(result) as T) : null;
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
    this.logger.log(`Delete cache for key: ${key}`);
  }

  async clear(): Promise<void> {
    await this.client.flushDb();
  }
}
