export enum ReplacementPolicies {
  FIFO = 'FIFO',
  LRU = 'LRU',
}

export type ReplacementPolicy = Readonly<{
  type: ReplacementPolicies
  limit: number
}>

export type CacheOptions = {
  ttl: number
  replacementPolicy?: ReplacementPolicy
  prefix?: string
}

export type CacheObj = Readonly<{
  data: string
  expiry_date: number
  attempts?: number
}>
