# react-native-cachemere
![npm version](https://img.shields.io/npm/v/react-native-cachemere)
![npm downloads](https://img.shields.io/npm/dt/react-native-cachemere)

An async cache manager.

## Installation
```
yarn add react-native-cachemere
```

## Usage
```js
import { Cache } from 'react-native-cachemere'
```

## API
### __constructor__
```js
const exampleCache = new Cache()
```
__name__: __`String`__

The `name` for this instance of `Cache`

__cacheOptions__: __`Object`__

Optional `cacheOptions` for this instance of `Cache`. Supports the following `key-value` pairs:

* `ttl` (_time to leave_), __Default: 1h__: caching time (in milliseconds) for all the keys of this instance of `Cache`. Cachemere exposes a number of predefined ttls:
```
Cache.TTL_12H = 43200
Cache.TTL_8H = 28800
Cache.TTL_6H = 21600
Cache.TTL_4H = 14400
Cache.TTL_1H = 3600
Cache.TTL_30M = 1800
```
* `replacementPolicy`, __Default: 'LRU'__: what algorithm to use when size of the `Cache` object has been reached. It supports `LRU` (least recent used) and `FIFO` (First In First Out)
* `size`, __Default: 10__: size of the `Cache` object. Number of elements that this instance of `Cache` can hold

### Example
```js
import { Cache, TTL_12H } from 'react-native-cachemere'

const postsCache = new Cache('posts')

const commentsCache = new Cache('comments', {
  ttl: TTL_12H,
  replacementPolicy: 'FIFO',
  size: 100
})
```

### __set__
```js
await exampleCache.set(key, data)
```
__key__: __`String`__

The `key` is a string used to set and get the cached data

__data__: __`Object`__

The `data` is a serializable object

Returns a `Promise`

### Example
```js
await postsCache.set('newPost', 'Hello World')
```


### __get__
```js
await exampleCache.set(key)
```
__key__: __`String`__

Returns a `Promise` with the data as a parsed JSON. If there's no cached data for that `key` or that data cache has expired, returns `null`.

> When cache expires it is automatically cleared from the storage.

### Example
```js
await postsCache.get('newPost')
```


### __getAll__
```js
await exampleCache.getAll()
```

Returns a `Promise` with an array with all cached objects, parsed.

### Example
```js
await postsCache.getAll()
```

### __clear__
```js
await exampleCache.clear(key?)
```
__key__: __`String`__

The `key` is a string used to remove that specified item from cache

If `key` is not specified, then it removes all keys from the current instance of `Cache`

Returns a `Promise`

### Example
```js
await postsCache.clear('newPost')

await postsCache.clear()
```


### __clearExpired__
```js
await exampleCache.clearExpired()
```

Remove all expired cache. Can be called at app startup to ensure a decluttered Storage.

Returns a `Promise`

### Example
```js
await postsCache.clearExpired()
```
