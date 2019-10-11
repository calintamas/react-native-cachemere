# react-native-cachemere
![npm version](https://img.shields.io/npm/v/react-native-cachemere)
![npm downloads](https://img.shields.io/npm/dt/react-native-cachemere)

An async cache manager.

## Install
Since `AsyncStorage` has been removed from the React Native core, you first need to install [@react-native-community/async-storage](https://github.com/react-native-community/async-storage). Then,
```
yarn add react-native-cachemere
```

## Example
```js
import Cache from 'react-native-cachemere'

const getData = async () => {
  const CACHE_KEY = `my_cache_key`;

  // First, try to get data from cache
  const cachedData = await Cache.get(CACHE_KEY);
  if (cachedData) {
    return cachedData
  }

  // If no cache is set, get data from server
  const data = await getDataFromServer();

  // Then, cache that data  
  const INVALIDATE_AFTER = 3; // the number of attempts after which the cache is invalidated
                              // if set to null, cache is only invalidated after TTL expires

  const TTL = Cache.TTL_12H;  // cache for 12h
  await Cache.set(CACHE_KEY, data, TTL, INVALIDATE_AFTER);

  return data
}
```

## Usage
### set
```js
await Cache.set(key, data, ttl, attempts)
```
`key` is a string used to set and get the cached data.

`data` must be serializable object.

`ttl` is expressed in seconds. There are some standard TTLs exposed by the lib.
```js
Cache.TTL_12H = 43200
Cache.TTL_8H = 28800
Cache.TTL_6H = 21600
Cache.TTL_4H = 14400
Cache.TTL_1H = 3600
```

`attempts` is an integer. Cache is invalidated after this number of attempts. If left unset (or set to `null`), cache is only invalidated after TTL expires.

### get
```js
await Cache.get(key)
```
Returns the data as a parsed JSON. If there's no cached data for that `key` or that data cache has expired, returns `null`.

> When cache expires it is automatically cleared from the storage.

### getAll
```js
const all = await Cache.getAll()
```
Returns an array with all cached objects, parsed.

### clear
```js
await Cache.clear(key)
```
Cache is removed for the specified `key`.

### clearExpired
```js
await Cache.clearExpired()
```
Remove all expired cache. Can be called at app startup to ensure a decluttered Storage.

### clearByRegex
```js
await Cache.clearByRegex()
```
Remove all cache with keys that pass the `regex` condition. 
Can be used when fetching the data with pagination and need to cache every group of data received.