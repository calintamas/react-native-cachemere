const PREFIX = '__cachemere__'

const isExpired = (expiryDate) => {
  const now = new Date();
  const expiryDateAsDate = new Date(expiryDate);

  return expiryDate < now
}

const addPrefix = (str = '') => {
  return `${PREFIX}${str}`
}

const stripPrefix = (str = '') => {
  return str.replace(PREFIX, '')
}

const onlyMyKeys = (allKeys = []) => {
  return allKeys.filter((item) => {
    return item.match(new RegExp(`^${PREFIX}+`))
  })
}

export {
  isExpired,
  addPrefix,
  stripPrefix,
  onlyMyKeys
}
