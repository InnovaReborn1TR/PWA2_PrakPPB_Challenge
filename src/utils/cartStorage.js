const KEY = 'bore_barrel_cart'

export const getCart = () => {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

const save = (items) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // The cart remains usable in memory for the current interaction.
  }
  return items
}

export const addToCart = (gun) => {
  if (!gun?.id) return getCart()
  const items = getCart()
  const existing = items.find((item) => String(item.id) === String(gun.id))
  if (existing) existing.quantity += 1
  else items.push({ ...gun, quantity: 1 })
  return save(items)
}

export const updateCartQuantity = (id, quantity) => {
  const items = getCart()
    .map((item) => String(item.id) === String(id)
      ? { ...item, quantity: Math.max(0, Number(quantity) || 0) }
      : item)
    .filter((item) => item.quantity > 0)
  return save(items)
}

export const removeFromCart = (id) => (
  save(getCart().filter((item) => String(item.id) !== String(id)))
)

export const clearCart = () => save([])
