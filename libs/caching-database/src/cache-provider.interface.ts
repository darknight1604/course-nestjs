export interface CacheProvider {
  set<T = any>(key: string, value: T, ttl?: number): Promise<void>;
  get<T = any>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
