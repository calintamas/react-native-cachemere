export interface StorageEngine {
  setItem<T>(key: string, value: T): Promise<boolean>;
  getItem<T>(key: string): Promise<T | null>;
  removeItem(key: string): Promise<boolean>;
  updateItem<T>(key: string, value: T): Promise<boolean>;
  multiGet(keys: string[]): Promise<{ key: string; value: unknown }[]>;
  multiRemove(keys: string[]): Promise<boolean>;
}
