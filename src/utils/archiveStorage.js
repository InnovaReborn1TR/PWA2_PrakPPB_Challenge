const KEY = 'bore_barrel_archived_guns'

const read = () => {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '{}')
    return value && typeof value === 'object' ? value : {}
  } catch {
    return {}
  }
}

const write = (value) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const getArchivedGuns = () => Object.values(read())

export const isArchived = (id) => Boolean(id && read()[String(id)])

export const archiveGun = (gun) => {
  if (!gun?.id) return false
  const archived = read()
  archived[String(gun.id)] = {
    ...gun,
    archivedAt: new Date().toISOString(),
  }
  return write(archived)
}

export const restoreGun = (id) => {
  const archived = read()
  delete archived[String(id)]
  return write(archived)
}

export const permanentlyDeleteGun = (id) => restoreGun(id)
