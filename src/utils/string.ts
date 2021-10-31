export function addPrefix(str: string, prefix: string) {
  return `${prefix}${str}`;
}

export function stripPrefix(str: string, prefix: string) {
  return str.replace(prefix, '');
}
