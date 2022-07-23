import { TTL_1H } from '../constants';
import { MemoryStorage } from '../storage';
import {
  CacheItem,
  CacheName,
  CacheOptions,
  ICache,
  InternalCacheItem
} from './types';

export class Cache<T extends CacheItem> implements ICache<T> {
  private name;

  private options;

  private memoryStorage;

  constructor(name: CacheName, options?: CacheOptions) {
    const {
      ttl = TTL_1H,
      size = 50,
      replacementPolicy = 'LRU'
    } = options ?? {};

    this.name = name;
    this.options = {
      ttl,
      size,
      replacementPolicy
    };
    this.memoryStorage = new MemoryStorage<T>();
  }

  async set<K extends T['key']>(
    key: K,
    value: NarrowByKey<T, K>['value']
  ): Promise<boolean> {
    // Add ttl to item
    const now = new Date();
    const item: InternalCacheItem<typeof value> = {
      value,
      expiryDate: now.setSeconds(now.getSeconds() + this.options.ttl)
    };

    // Check if cache is full
    const size = this.memoryStorage.size();
    if (size >= this.options.size) {
      // Drop items, if needed
      this.dropItem();
    }

    const isStored = await this.memoryStorage.set(key, item);

    return isStored;
  }

  async get<K extends T['key']>(
    key: K
  ): Promise<NarrowByKey<T, K>['value'] | undefined> {
    const value = await this.memoryStorage.get(key);
    return value;
  }

  private dropItem() {
    switch (this.options.replacementPolicy) {
      case 'FIFO':
        break;

      default:
        throw new Error(
          `${this.options.replacementPolicy} replacementPolicy not implemented`
        );
    }
  }
}
