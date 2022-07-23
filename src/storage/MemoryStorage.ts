import { ItemNotFoundError } from './ItemNotFoundError';
import { StorageEngine } from './types';

export type StorageData = {
  key: string;
  value: unknown;
};

type NarrowByKey<T, N> = T extends { key: N } ? T : never;

export class MemoryStorage<T extends StorageData> implements StorageEngine {
  private storage: Map<T['key'], Promise<T['value']>>;

  constructor() {
    this.storage = new Map();
  }

  async setItem<K extends T['key']>(
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

  getItem<K extends T['key']>(
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
        return resolve(undefined);
      }
    });
  }

  removeItem(key: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (!key) {
          throw new Error('A key is required');
        }
        delete this.storage[key];
        return resolve(true);
      } catch (err) {
        return resolve(false);
      }
    });
  }

  updateItem<T>(key: string, value: T): Promise<boolean> {
    return this.setItem(key, value);
  }

  multiGet(keys: string[]): Promise<{ key: string; value: unknown }[]> {
    return new Promise((resolve) => {
      try {
        if (!keys.length) {
          throw new Error('An array of keys is required');
        }
        const values = Object.entries(this.storage)
          .filter(([key, value]) => keys.includes(key) && value !== undefined)
          .map(([key, value]) => {
            const parsedValue = JSON.parse(value as string);
            return {
              value: parsedValue,
              key
            };
          });
        return resolve(values);
      } catch (err) {
        return resolve([]);
      }
    });
  }

  multiRemove(keys: string[]): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (!keys.length) {
          throw new Error('An array of keys is required');
        }
        keys.forEach((key) => delete this.storage[key]);
        return resolve(true);
      } catch (err) {
        return resolve(false);
      }
    });
  }
}

type KeyMap =
  | {
      key: 'test';
      value: {
        foo: string;
      };
    }
  | {
      key: 'test2';
      value: {
        bar: string;
      };
    };

const cache = new MemoryStorage<KeyMap>();

cache.setItem('test', {
  foo: '2'
});

const val = await cache.getItem('test2');
if (val) {
  val.bar;
}
