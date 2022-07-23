type NarrowByKey<T, K> = T extends { key: K } ? T : never;
