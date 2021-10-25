import { CacheOptions } from './types';

export class Cache {
  ttl: CacheOptions['ttl'];

  constructor({ ttl }: CacheOptions) {
    this.ttl = ttl;
  }
}
