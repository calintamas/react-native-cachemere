/* eslint-env jest */

import { DiskStorage } from '../DiskStorage';

const setup = () => {
  const storage = new DiskStorage();
  return {
    storage
  };
};

describe('test DiskStorage', () => {
  it('creates the storage', () => {
    const { storage } = setup();

    expect(storage.storage).toBeTruthy();
  });

  it('adds an item', async () => {
    const { storage } = setup();

    const item = {
      key: 'foo',
      value: {
        bar: 'baz'
      }
    };
    const isStored = await storage.setItem(item.key, item.value);

    expect(isStored).toBe(true);
    const storedItem = await storage.getItem(item.key);
    expect(storedItem).toEqual(item.value);
  });

  it('fails to add an item', async () => {
    const { storage } = setup();

    const item = {
      key: 'bigIntPayload',
      value: 2n // BigInt value, JSON.stringify should throw
    };
    const isStored = await storage.setItem(item.key, item.value);

    expect(isStored).toBe(false);
    const storedItem = await storage.getItem(item.key);
    expect(storedItem).toBe(null);
  });

  it('removes an item', async () => {
    const { storage } = setup();

    const item = {
      key: 'foo3',
      value: {
        bar: 42
      }
    };
    const isStored = await storage.setItem(item.key, item.value);
    expect(isStored).toBe(true);
    const isRemoved = await storage.removeItem(item.key);

    expect(isRemoved).toBe(true);
    const storedItem = await storage.getItem(item.key);
    expect(storedItem).toBe(null);
  });

  it('fails to remove an item', async () => {
    const { storage } = setup();

    const isRemoved = await storage.removeItem('');

    expect(isRemoved).toBe(false);
  });

  it('updates an item', async () => {
    const { storage } = setup();

    const item = {
      key: 'foo',
      value: {
        bar: 'baz'
      }
    };
    const isStored = await storage.setItem(item.key, item.value);

    expect(isStored).toBe(true);
    let storedItem = await storage.getItem(item.key);
    expect(storedItem).toEqual(item.value);

    const updatedItem = {
      key: item.key,
      value: {
        ...item.value,
        env: 'test'
      }
    };
    const isUpdated = await storage.updateItem(
      updatedItem.key,
      updatedItem.value
    );

    expect(isUpdated).toBe(true);
    storedItem = await storage.getItem(updatedItem.key);
    expect(storedItem).toEqual(updatedItem.value);
  });

  it('gets multiple items', async () => {
    const { storage } = setup();

    const items = [
      {
        key: 'one',
        value: 1
      },
      {
        key: 'two',
        value: 2
      },
      {
        key: 'three',
        value: 3
      }
    ];
    const setOpResults = await Promise.all(
      items.map((item) => storage.setItem(item.key, item.value))
    );
    expect(setOpResults.find((i) => i === false)).toBe(undefined);

    const storedItems = await storage.multiGet(['one', 'two']);
    expect(storedItems).toEqual([
      {
        key: 'one',
        value: 1
      },
      {
        key: 'two',
        value: 2
      }
    ]);
  });

  it('fails to get multiple items', async () => {
    const { storage } = setup();

    const storedItems = await storage.multiGet([]);
    expect(storedItems).toEqual([]);
  });

  it('removes multiple items', async () => {
    const { storage } = setup();

    const items = [
      {
        key: 'one',
        value: 1
      },
      {
        key: 'two',
        value: 2
      },
      {
        key: 'three',
        value: 3
      }
    ];
    const setOpResults = await Promise.all(
      items.map((item) => storage.setItem(item.key, item.value))
    );
    expect(setOpResults.find((i) => i === false)).toBe(undefined);

    const result = await storage.multiRemove(['one', 'two']);
    expect(result).toBe(true);

    const storedItems = await storage.multiGet(['one', 'two']);
    expect(storedItems).toEqual([]);
  });

  it('fails to remove multiple items', async () => {
    const { storage } = setup();

    const result = await storage.multiRemove([]);
    expect(result).toBe(false);
  });
});
