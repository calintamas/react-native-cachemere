import AsyncStorage, {
  AsyncStorageStatic,
} from '@react-native-async-storage/async-storage'

import Utils from './utils'

class Storage {
  StorageSystem: AsyncStorageStatic

  constructor() {
    this.StorageSystem = AsyncStorage
  }

  async store(key: string, value: any): Promise<string | null> {
    try {
      await this.StorageSystem.setItem(key, JSON.stringify(value))

      return value
    } catch (err) {
      return null
    }
  }

  async get(key: string): Promise<any> {
    try {
      const value = await this.StorageSystem.getItem(key)

      if (value === null) {
        return value
      }

      return JSON.parse(value)
    } catch (err) {
      return null
    }
  }

  async remove(key: string): Promise<boolean> {
    try {
      await this.StorageSystem.removeItem(key)

      return true
    } catch (err) {
      return false
    }
  }

  async update(key: string, data: string): Promise<string | null> {
    return this.store(key, data)
  }

  // Gets all keys known to your app, for all callers, libraries.
  async getAllKeys(): Promise<string[]> {
    try {
      const allKeys = await this.StorageSystem.getAllKeys()

      return allKeys
    } catch (err) {
      return []
    }
  }

  async multiGet(keys: string[] = [], preserveKeys = false) {
    try {
      const all: [string, string | null][] = await this.StorageSystem.multiGet(
        keys
      )

      return all.map((item) => {
        return {
          ...JSON.parse(String(item[1])),
          __cachemere__key: preserveKeys ? item[0] : Utils.stripPrefix(item[0]),
        }
      })
    } catch (err) {
      return []
    }
  }

  async multiRemove(keys: string[] = []): Promise<boolean> {
    try {
      await this.StorageSystem.multiRemove(keys)

      return true
    } catch (err) {
      return false
    }
  }
}

export default Storage
