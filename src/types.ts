export type CacheReplacementPolicy = 'LRU' | 'FIFO';
export type CacheTTL = number;
export type CacheSize = number;

export type CacheOptions = {
  ttl?: CacheTTL;
  size?: CacheSize;
  replacementPolicy?: CacheReplacementPolicy;
};

export type CacheObj<DataType> = Readonly<{
  data: DataType;
  expiryDate: number;
}>;
