import Storage from './storage'
import { isExpired, addPrefix, onlyMyKeys } from './utils'

class Cache {
  static set(key, data, ttl, attempts = null) {
    const now = new Date();
    let payload = {
      data,
      expiry_date: now.setSeconds(now.getSeconds() + ttl), // save as Unix timestamp (miliseconds)
    };

    // Cache data can be invalidated after a number of attempts,
    // or it can live until expiry_date if the 'attempts' param is null
    if (attempts) {
      payload = {
        ...payload,
        attempts
      }
    }

    return Storage.store(addPrefix(key), payload);
  }

  static async get(key) {
    try {
      const payload = await Storage.get(addPrefix(key));
      if (!payload) {
        throw new Error('No cached data');
      }

      if (isExpired(payload.expiry_date)) {
        this.clear(key);
        throw new Error('Expired cached data');
      }

      // If a max number of attempts has been set,
      // check if it's been passed or not
      if (payload.attempts != null) {
        if (payload.attempts === 0) {
          throw new Error('Invalidated cached data');
        }

        await this._update(key, {
          ...payload,
          attempts: payload.attempts - 1
        });
      }

      return payload.data
    } catch (err) {
      return null
    }
  }

  static async getAll(options = {}) {
    const allKeys = await Storage.getAllKeys()
    const myKeys = onlyMyKeys(allKeys)
    return Storage.multiGet(myKeys, options.preserveKeys)
  }

  static _update(key, data) {
    return Storage.update(addPrefix(key), data);
  }

  static clear(key) {
    return Storage.remove(addPrefix(key));
  }

  static async clearExpired() {
    const all = await this.getAll({ preserveKeys: true });
    const expiredKeys = all.filter(i => isExpired(i.expiry_date)).map(i => i.__cachemere__key)
    return Storage.multiRemove(expiredKeys)
  }

  static async clearByRegex(regex) {
    const all = await this.getAll()
    const matchedKeys = all.filter(i => i.__cachemere__key.match(new RegExp(regex))).map(i => addPrefix(i.__cachemere__key))
    return Storage.multiRemove(matchedKeys)
  }

  // Define some static TTLs
  // in seconds
  static TTL_12H = 43200
  static TTL_8H = 28800
  static TTL_6H = 21600
  static TTL_4H = 14400
  static TTL_1H = 3600
}

export default Cache
