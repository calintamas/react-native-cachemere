export type ReplacementPolicy = Readonly<{
  type: ''
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
