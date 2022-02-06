import { TTL_1H } from './constants';
import { Storage } from './Storage';
import {
  CacheObj,
  CacheOptions,
  CacheReplacementPolicy,
  CacheSize,
  CacheTTL
} from './types';
import { addPrefix, stripPrefix } from './utils/string';

function isExpired(expiryDate: number | string | Date) {
  const now = new Date();
  const expiryDateAsDate = new Date(expiryDate);
  return expiryDateAsDate < now;
}

export class Cache<DataType> {
  storage: Storage<CacheObj<DataType>>;

  name: string;

  ttl: CacheTTL;

  replacementPolicy: CacheReplacementPolicy;

  size: CacheSize;

  constructor(cacheName: string, cacheOptions?: CacheOptions) {
    const {
      ttl = TTL_1H,
      replacementPolicy = 'LRU',
      size = 10 // TODO maybe increase this?
    } = cacheOptions ?? {};

    this.storage = new Storage();
    this.name = cacheName;
    this.ttl = ttl;
    this.replacementPolicy = replacementPolicy;
    this.size = size;
  }

  async set(key: string, data: DataType) {
    const now = new Date();
    const payload: CacheObj<DataType> = {
      data,
      expiryDate: now.setSeconds(now.getSeconds() + this.ttl) // save as Unix timestamp (milliseconds)
    };

    if (this.replacementPolicy === 'FIFO') {
      const allKeys = await this.getAll();

      if (allKeys.length >= this.size) {
        const sortedList = allKeys.sort((a, b) =>
          a.expiryDate > b.expiryDate ? 1 : -1
        );

        await this.clear(stripPrefix(sortedList[0].key, this.name));
      }
    }

    return this.storage.store(addPrefix(key, this.name), payload);
  }

  async get(key: string) {
    try {
      const res = await this.storage.get(addPrefix(key, this.name));
      if (!res) {
        throw new Error('No cached data');
      }

      if (isExpired(res.expiryDate)) {
        this.clear(key);
        throw new Error('Expired cached data');
      }

      return res.data;
    } catch (err) {
      return null;
    }
  }

  async getAll() {
    const keys = await this.storage.getKeysWithPrefix(this.name);
    return this.storage.multiGet(keys);
  }

  async clear(key?: string) {
    if (!key) {
      const keys = await this.storage.getKeysWithPrefix(this.name);
      return this.storage.multiRemove(keys);
    }

    return this.storage.remove(addPrefix(key, this.name));
  }

  async clearExpired() {
    const all = await this.getAll();
    const expiredKeys = all
      .filter((item) => isExpired(item.expiryDate))
      .map((item) => item.key);

    return this.storage.multiRemove(expiredKeys);
  }
}
