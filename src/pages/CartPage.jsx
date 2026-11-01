import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { buildWhatsAppUrl } from '../utils/share'
import { formatPrice } from '../utils/helpers'

export default function CartPage() {
  const { items, update, remove } = useCart()
  const total = items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0)

  const checkout = () => {
    try {
      const url = buildWhatsAppUrl(items, import.meta.env.VITE_WHATSAPP_NUMBER)
      window.location.assign(url)
    } catch (error) {
      window.alert(error.message)
    }
  }

  return (
    <section className="cart-page">
      <div className="masthead">
        <h1 className="display">Procurement Cart</h1>
        <p className="lede">Review quantities before sending your order to WhatsApp.</p>
      </div>
      {items.length === 0 ? (
        <div className="state-box">
          <ShoppingCart size={28} />
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li className="cart-item" key={item.id}>
                <img src={item.image_url || item.image || '/guns/pistol.svg'} alt="" loading="lazy" />
                <div className="cart-item__info">
                  <strong>{item.name}</strong>
                  <span>{formatPrice(item.price)}</span>
                </div>
                <div className="cart-item__controls">
                  <button type="button" className="icon-btn" onClick={() => update(item.id, item.quantity - 1)} aria-label="Decrease quantity"><Minus size={16} /></button>
                  <span>{item.quantity}</span>
                  <button type="button" className="icon-btn" onClick={() => update(item.id, item.quantity + 1)} aria-label="Increase quantity"><Plus size={16} /></button>
                  <button type="button" className="icon-btn" onClick={() => remove(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <strong>Total: {formatPrice(total)}</strong>
            <button type="button" className="btn btn--primary" onClick={checkout}>Checkout via WhatsApp</button>
          </div>
        </>
      )}
    </section>
  )
}
