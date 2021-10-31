import AsyncStorage from '@react-native-async-storage/async-storage';

import { Storage } from '../Storage';

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

describe('Storage', () => {
  const storage = new Storage();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly set a value and return true', async () => {
    const result = await storage.store('test', 'value');

    expect(AsyncStorage.setItem).toBeCalled();
    expect(result).toBe(true);
  });

  it('should return false if set is failing', async () => {
    const result = await storage.store('test', undefined);

    expect(result).toBe(false);
  });

  it('should correctly get a value', async () => {
    await storage.store('test', 'value');

    expect(AsyncStorage.setItem).toBeCalled();

    const result = await storage.get('test');

    expect(AsyncStorage.getItem).toBeCalled();
    expect(result).toBe('value');
  });

  it('should return null if searched key is not set', async () => {
    const result = await storage.get('invalidKey');

    expect(AsyncStorage.getItem).toBeCalled();
    expect(result).toBe(null);
  });

  it('should correctly remove key and return true', async () => {
    const result = await storage.remove('value');

    expect(AsyncStorage.removeItem).toBeCalled();
    expect(result).toBe(true);
  });

  it('should return false if remove is failing', async () => {
    const result = await storage.remove('');

    expect(AsyncStorage.removeItem).toBeCalled();
    expect(result).toBe(false);
  });

  it('should correctly update key', async () => {
    await storage.update('test', 'value');

    expect(AsyncStorage.setItem).toBeCalled();
  });

  it('should correctly get all keys with specific prefix', async () => {
    const prefix = 'test_';

    await storage.store(`${prefix}test1`, 'value1');
    await storage.store(`${prefix}test2`, 'value2');

    const result = await storage.getKeysWithPrefix(prefix);

    expect(result).toEqual(['test_test1', 'test_test2']);
  });

  it('should correctly multi get keys', async () => {
    await storage.store('multiGet1', 'value1');
    await storage.store('multiGet2', 'value2');

    const result = await storage.multiGet(['multiGet1', 'multiGet2']);

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

  it('should return empty array if error', async () => {
    const result = await storage.multiGet([]);

    expect(result).toEqual([]);
  });

  it('should return true if multiRemove is successfully', async () => {
    await storage.store('keyToRemove1', 'value1');
    await storage.store('keyToRemove2', 'value2');

    const result = await storage.multiRemove(['keyToRemove1', 'keyToRemove2']);

    expect(result).toEqual(true);
  });

  it('should return false if multiRemove has an error', async () => {
    const result = await storage.multiRemove([]);

    expect(result).toEqual(false);
  });

  it('should return false if multiRemove has no parameter', async () => {
    const result = await storage.multiRemove();

    expect(result).toEqual(false);
  });
});
