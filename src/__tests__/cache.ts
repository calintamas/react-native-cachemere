import MockDate from 'mockdate';

import { Cache } from '../Cache';
import { TTL_1H } from '../constants';

describe('Cache', () => {
  const testCache = new Cache('test');

  MockDate.set('2021-10-31');

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
        data: 'value',
        expiryDate: 1635645600000,
        key: 'testkey'
      },
      {
        data: 'value',
        expiryDate: 1635645600000,
        key: 'testmultiGet1'
      },
      {
        data: 'value',
        expiryDate: 1635645600000,
        key: 'testmultiGet2'
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
