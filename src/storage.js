import AsyncStorage from '@react-native-community/async-storage'

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
  // Returns an Array of Strings if successful, null otherwise
  static async getAllKeys() {
    try {
      const allKeys = await StorageSystem.getAllKeys();
      return allKeys
    } catch (err) {
      return null
    }
  }
}

export default Storage
