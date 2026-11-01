const entries = new Map()
const DEFAULT_TTL = 60 * 1000

export const getCached = (key) => {
  const entry = entries.get(key)
  if (!entry || entry.expiresAt <= Date.now()) {
    entries.delete(key)
    return undefined
  }
  return entry.value
}

export const setCached = (key, value, ttl = DEFAULT_TTL) => {
  entries.set(key, { value, expiresAt: Date.now() + ttl })
  return value
}

export const invalidateCache = (prefix = '') => {
  for (const key of entries.keys()) {
    if (!prefix || key.startsWith(prefix)) entries.delete(key)
  }
}

export const clearCache = () => entries.clear()
