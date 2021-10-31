import AsyncStorage, {
  AsyncStorageStatic
} from '@react-native-async-storage/async-storage';

export class Storage<DataType> {
  StorageSystem: AsyncStorageStatic;

  constructor() {
    this.StorageSystem = AsyncStorage;
  }

  async store(key: string, value: DataType): Promise<boolean> {
    try {
      await this.StorageSystem.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  async get(key: string): Promise<DataType | null> {
    try {
      const data = await this.StorageSystem.getItem(key);
      if (!data) {
        throw new Error('No data');
      }
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  }

  async remove(key: string): Promise<boolean> {
    try {
      await this.StorageSystem.removeItem(key);
      return true;
    } catch (err) {
      return false;
    }
  }

  async update(key: string, data: DataType): Promise<boolean> {
    return this.store(key, data);
  }

  async getKeysWithPrefix(prefix: string): Promise<string[]> {
    try {
      const keys = await this.StorageSystem.getAllKeys();
      const keysWithPrefix = keys.filter((item) =>
        item.match(new RegExp(`^${prefix}+`))
      );
      return keysWithPrefix;
    } catch (err) {
      return [];
    }
  }

  async multiGet(keys: string[]): Promise<(DataType & { key: string })[]> {
    try {
      const all = await this.StorageSystem.multiGet(keys);
      const definedValues = all.filter(([, value]) => value !== null);

      return definedValues.map(([key, value]) => {
        const data = JSON.parse(value as string) as DataType;
        return {
          ...data,
          key
        };
      });
    } catch (err) {
      return [];
    }
  }

  async multiRemove(keys: string[] = []): Promise<boolean> {
    try {
      await this.StorageSystem.multiRemove(keys);

      return true;
    } catch (err) {
      return false;
    }
  }
}
