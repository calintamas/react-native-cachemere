import type { Storage, StorageItem } from './types';

export class MemoryStorage<T extends StorageItem> implements Storage<T> {
  private storage: Map<T['key'], Promise<T['value']>>;

  constructor() {
    this.storage = new Map();
  }

  set<K extends T['key']>(
    key: K,
    value: NarrowByKey<T, K>['value']
  ): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.storage.set(key, Promise.resolve(value));
        return resolve(true);
      } catch {
        return resolve(false);
      }
    });
  }

  get<K extends T['key']>(
    key: K
  ): Promise<NarrowByKey<T, K>['value'] | undefined> {
    return new Promise((resolve) => {
      try {
        const value = this.storage.get(key);
        if (value === undefined) {
          throw new Error(`Value for key '${key}' not found`);
        }
        return resolve(value);
      } catch {
        this.storage.delete(key);
        return resolve(undefined);
      }
    });
  }

  size() {
    return this.storage.size;
  }
}
