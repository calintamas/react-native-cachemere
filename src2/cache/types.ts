export type CacheName = string;
export type CacheOptions = {
  ttl: number;
  size: number;
  replacementPolicy: 'LRU' | 'FIFO';
};

export type CacheItem = {
  key: string;
  value: unknown;
};

export type InternalCacheItem<T> = {
  value: T;
  /**
   * Unix timestamp (ms)
   */
  expiryDate: number;
};

export interface ICache<T extends CacheItem> {
  set<K extends T['key']>(
    key: K,
    value: NarrowByKey<T, K>['value']
  ): Promise<boolean>;

  get<K extends T['key']>(
    key: K
  ): Promise<NarrowByKey<T, K>['value'] | undefined>;
}
