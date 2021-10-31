import { Cache } from '../Cache';
import { TTL_1H } from '../constants';

const items: any = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn((item, value) => {
    if (!value) {
      return Promise.reject(new Error('error'));
    }

    return new Promise((resolve) => {
      items[item] = value;
      resolve(value);
    });
  }),

  getItem: jest.fn((item) => Promise.resolve(items[item])),

  removeItem: jest.fn((item) => {
    if (!item) {
      return Promise.reject(new Error('error'));
    }

    return new Promise((resolve) => {
      delete items[item];
      resolve(items);
    });
  }),

  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(items))),

  multiGet: jest.fn((keys: string[]) => {
    if (!keys.length) {
      return Promise.reject(new Error('error'));
    }

    return Promise.resolve([
      ['multiGet1', '"value1"'],
      ['multiGet2', '"value2"']
    ]);
  }),

  multiRemove: jest.fn((keys: string[]) => {
    if (!keys.length) {
      return Promise.reject(new Error('error'));
    }

    return new Promise((resolve) => {
      keys.forEach((key) => delete items[key]);
      resolve(items);
    });
  })
}));

jest.mock('./Cache', () => ({
  ...jest.requireActual('./Cache'),
  isExpired: jest.fn(() => false)
}));

describe('Cache', () => {
  const testCache = new Cache('test');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set default data', () => {
    expect(testCache.name).toBe('test');
    expect(testCache.ttl).toBe(TTL_1H);
    expect(testCache.replacementPolicy).toBe('LRU');
  });

  it('should correctly call set function', async () => {
    const result = await testCache.set('key', 'value');

    expect(result).toBe(true);
  });

  it('should correctly call get function', async () => {
    const result = await testCache.get('key');

    expect(result).toBe('value');
  });

  it('should return null if key is invalid', async () => {
    const result = await testCache.get('invalidKey');

    expect(result).toBe(null);
  });

  it('should correctly return all keys', async () => {
    await testCache.set('multiGet1', 'value');
    await testCache.set('multiGet2', 'value');
    const result = await testCache.getAll();

    expect(result).toEqual([
      {
        '0': 'v',
        '1': 'a',
        '2': 'l',
        '3': 'u',
        '4': 'e',
        '5': '1',
        key: 'multiGet1'
      },
      {
        '0': 'v',
        '1': 'a',
        '2': 'l',
        '3': 'u',
        '4': 'e',
        '5': '2',
        key: 'multiGet2'
      }
    ]);
  });

  it('should correctly call clear function', async () => {
    await testCache.set('clearKey', 'value');
    const result = await testCache.clear('clearKey');

    expect(result).toBe(true);
  });

   it('should correctly call clear function with no specific key', async () => {
     await testCache.set('clearKey', 'value');
     const result = await testCache.clear();

     expect(result).toBe(true);
   });
});
