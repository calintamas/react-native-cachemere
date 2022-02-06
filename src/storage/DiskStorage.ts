import AsyncStorage, {
  AsyncStorageStatic
} from '@react-native-async-storage/async-storage';

import { ItemNotFoundError } from './ItemNotFoundError';
import { StorageEngine } from './types';

export class DiskStorage implements StorageEngine {
  storage: AsyncStorageStatic;

  constructor() {
    this.storage = AsyncStorage;
  }

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await this.storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const serializedValue = await this.storage.getItem(key);
      if (serializedValue === null) {
        throw new ItemNotFoundError(`Value for key '${key}' not found`);
      }
      const value = JSON.parse(serializedValue);
      return value;
    } catch (err) {
      return null;
    }
  }

  async removeItem(key: string): Promise<boolean> {
    try {
      if (!key) {
        throw new Error('A key is required');
      }
      await this.storage.removeItem(key);
      return true;
    } catch (err) {
      return false;
    }
  }

  updateItem<T>(key: string, value: T): Promise<boolean> {
    return this.setItem(key, value);
  }

  async multiGet(keys: string[]): Promise<{ key: string; value: unknown }[]> {
    try {
      if (!keys.length) {
        throw new Error('An array of keys is required');
      }
      const serializedValues = await this.storage.multiGet(keys);

      const values = serializedValues
        .filter(([, value]) => value !== null)
        .map(([key, value]) => {
          const parsedValue = JSON.parse(value as string);
          return {
            value: parsedValue,
            key
          };
        });
      return values;
    } catch (err) {
      return [];
    }
  }

  async multiRemove(keys: string[]): Promise<boolean> {
    try {
      if (!keys.length) {
        throw new Error('An array of keys is required');
      }
      await this.storage.multiRemove(keys);
      return true;
    } catch (err) {
      return false;
    }
  }
}
