import Storage from './Storage'
import { CacheObj, CacheOptions } from './types'
import Utils from './utils'

export class Cache {
  storage: Storage
  ttl: CacheOptions['ttl']
  replacementPolicy: CacheOptions['replacementPolicy']
  prefix: CacheOptions['prefix']

  constructor({ ttl, replacementPolicy, prefix }: CacheOptions) {
    this.storage = new Storage()
    this.ttl = ttl
    this.replacementPolicy = replacementPolicy
    this.prefix = prefix

    if (prefix) {
      Utils.setPrefix(prefix)
    }
  }

  set(key: string, data: string, attempts?: number) {
    const now = new Date()
    let payload: CacheObj = {
      data,
      expiry_date: now.setSeconds(now.getSeconds() + this.ttl), // save as Unix timestamp (miliseconds)
    }

    // Cache data can be invalidated after a number of attempts,
    // or it can live until expiry_date if the 'attempts' param is null
    if (attempts) {
      payload = {
        ...payload,
        attempts,
      }
    }

    return this.storage.store(Utils.addPrefix(key), payload)
  }

  async get(key: string) {
    try {
      const payload = await this.storage.get(Utils.addPrefix(key))

      if (!payload) {
        throw new Error('No cached data')
      }

      if (Utils.isExpired(payload.expiry_date)) {
        this.clear(key)
        throw new Error('Expired cached data')
      }

      // If a max number of attempts has been set,
      // check if it's been passed or not
      if (payload.attempts != null) {
        if (payload.attempts === 0) {
          throw new Error('Invalidated cached data')
        }

        await this.update(key, {
          ...payload,
          attempts: payload.attempts - 1,
        })
      }

      return payload.data
    } catch (err) {
      return null
    }
  }

  async getAll(preserveKeys?: boolean) {
    const allKeys = await this.storage.getAllKeys()
    const myKeys = Utils.onlyMyKeys(allKeys)

    return this.storage.multiGet(myKeys, preserveKeys)
  }

  private update(key: string, data: string) {
    return this.storage.update(Utils.addPrefix(key), data)
  }

  async clear(key?: string): Promise<boolean> {
    if (!key) {
      const all = await this.getAll(true)
      const keys = all.map((i) => i.__cachemere__key)

      return this.storage.multiRemove(keys)
    }

    return this.storage.remove(Utils.addPrefix(key))
  }

  async clearExpired() {
    const all = await this.getAll(true)
    const expiredKeys = all
      .filter((i) => Utils.isExpired(i.expiry_date))
      .map((i) => i.__cachemere__key)

    return this.storage.multiRemove(expiredKeys)
  }
}
