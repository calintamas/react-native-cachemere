import { ItemNotFoundError } from './ItemNotFoundError';
import { StorageEngine } from './types';

export class MemoryStorage implements StorageEngine {
  storage: Record<string, string>;

  constructor() {
    this.storage = {};
  }

  setItem<T>(key: string, value: T): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.storage[key] = JSON.stringify(value);
        return resolve(true);
      } catch (err) {
        return resolve(false);
      }
    });
  }

  getItem<T>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
      try {
        const serializedValue = this.storage[key];
        if (serializedValue === undefined) {
          throw new ItemNotFoundError(`Value for key '${key}' not found`);
        }
        const value = JSON.parse(serializedValue);
        return resolve(value);
      } catch (err) {
        return resolve(null);
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
