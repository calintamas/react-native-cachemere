const Utils = {
  prefix: '__cachemere__',

  setPrefix: (value: string) => {
    Utils.prefix = value
  },

  getPrefix: (): string => {
    return Utils.prefix
  },

  isExpired: (expiryDate: number | string | Date): boolean => {
    const now = new Date()
    const expiryDateAsDate = new Date(expiryDate)

    return expiryDateAsDate < now
  },

  addPrefix: (str = ''): string => {
    return `${Utils.prefix}${str}`
  },

  stripPrefix: (str = ''): string => {
    return str.replace(Utils.prefix, '')
  },

  onlyMyKeys: (allKeys: string[] = []): string[] => {
    return allKeys.filter((item) => {
      return item.match(new RegExp(`^${Utils.prefix}+`))
    })
  },
}

export default Utils
