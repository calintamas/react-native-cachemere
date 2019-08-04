import Storage from './storage'

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

    return Storage.store(key, payload);
  }

  static async get(key) {
    try {
      const payload = await Storage.get(key);
      if (!payload) {
        throw new Error('No cached data');
      }

      const now = new Date();
      const expiryDate = new Date(payload.expiry_date);

      if (expiryDate < now) {
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

  static _update(key, data) {
    return Storage.update(key, data);
  }

  static clear(key) {
    return Storage.remove(key);
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
