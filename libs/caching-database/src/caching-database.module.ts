import { Global, Module } from '@nestjs/common';
import { CachingDatabaseService } from './caching-database.service';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheProvider } from './redis-cache.provider';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    CachingDatabaseService,
    {
      provide: 'CACHE_PROVIDER',
      useClass: RedisCacheProvider, // <-- Swap implementation here
    },
  ],
  exports: [CachingDatabaseService],
})
export class CachingDatabaseModule {}
