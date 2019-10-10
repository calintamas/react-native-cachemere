import AsyncStorage from '@react-native-community/async-storage'
import { stripPrefix } from './utils'

const StorageSystem = AsyncStorage;

class Storage {
  static async store(key, value) {
    try {
      await StorageSystem.setItem(key, JSON.stringify(value));
      return value
    } catch (err) {
      return null
    }
  }

  static async get(key) {
    try {
      const value = await StorageSystem.getItem(key);
      return JSON.parse(value)
    } catch (err) {
      return null
    }
  }

  static async remove(key) {
    try {
      await StorageSystem.removeItem(key);
      return true
    } catch (err) {
      return false
    }
  }

  static async update(key, data) {
    return this.store(key, data);
  }

  // Gets all keys known to your app, for all callers, libraries.
  // Returns an Array of Strings if successful, [] otherwise
  static async getAllKeys() {
    try {
      const allKeys = await StorageSystem.getAllKeys();
      return allKeys
    } catch (err) {
      return []
    }
  }

  static async multiRemove(keys = []) {
    try {
      await StorageSystem.multiRemove(keys)
      return true
    } catch (err) {
      return false
    }
  }

  static async multiGet(keys = [], preserveKeys = false) {
    try {
      const all = await StorageSystem.multiGet(keys);
      // all is an array of arrays of [key, value]
      // eg: [["__cachemere__test1", {"data":{"foo":"bar"},"expiry_date":1570727365829}]]

      return all.map((item) => {
        return ({
          ...JSON.parse(item[1]),
          __cachemere__key: preserveKeys ? item[0] : stripPrefix(item[0])
        })
      })
    } catch (err) {
      return []
    }
  }
}

export default Storage
