import { useEffect, useState } from 'react'
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from '../utils/cartStorage'

export function useCart() {
  const [items, setItems] = useState(getCart)

  useEffect(() => {
    const handleCartUpdate = () => setItems(getCart())
    window.addEventListener('cart-updated', handleCartUpdate)
    return () => window.removeEventListener('cart-updated', handleCartUpdate)
  }, [])

  const refresh = (nextItems) => {
    setItems(nextItems)
    window.dispatchEvent(new Event('cart-updated'))
    return nextItems
  }

  return {
    items,
    add: (gun) => refresh(addToCart(gun)),
    update: (id, quantity) => refresh(updateCartQuantity(id, quantity)),
    remove: (id) => refresh(removeFromCart(id)),
    clear: () => refresh(clearCart()),
  }
}
