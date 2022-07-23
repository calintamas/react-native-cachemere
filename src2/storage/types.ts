export type StorageItem = {
  key: string;
  value: unknown;
};

export interface Storage<T extends StorageItem> {
  set<K extends T['key']>(
    key: K,
    value: NarrowByKey<T, K>['value']
  ): Promise<boolean>;

  get<K extends T['key']>(
    key: K
  ): Promise<NarrowByKey<T, K>['value'] | undefined>;
}
