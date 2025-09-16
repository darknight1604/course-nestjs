import { Inject, Injectable } from '@nestjs/common';
import * as cacheProviderInterface from './cache-provider.interface';

@Injectable()
export class CachingDatabaseService {
  constructor(
    @Inject('CACHE_PROVIDER')
    private readonly cacheProvider: cacheProviderInterface.CacheProvider,
  ) {}

  async set<T>(key: string, value: T, ttl?: number) {
    return this.cacheProvider.set(key, value, ttl);
  }

  async get<T>(key: string) {
    return this.cacheProvider.get<T>(key);
  }

  async delete(key: string) {
    return this.cacheProvider.delete(key);
  }

  async clear() {
    return this.cacheProvider.clear();
  }
}
