import { useCart } from '../context/CartContext'
import { useState } from 'react'
import './Cart.css'

function Cart({ onCheckout, deliveryType, setDeliveryType, setPaymentType, paymentType }: {
  onCheckout?: () => void,
  deliveryType: 'envio' | 'sucursal',
  setDeliveryType: (type: 'envio' | 'sucursal') => void,
  setPaymentType: (type: 'paypal' | 'mercadopago' | 'transferencia') => void,
  paymentType: 'paypal' | 'mercadopago' | 'transferencia'
}) {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const [removedMsg, setRemovedMsg] = useState<string | null>(null)
  // El estado de paymentType ahora se maneja en App

  const handleRemove = (id: number, size: string, color: string) => {
    removeFromCart(id, size, color)
    setRemovedMsg('Producto eliminado')
    setTimeout(() => setRemovedMsg(null), 1500)
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <p>Añade productos para continuar comprando</p>
        {removedMsg && <div className="cart-removed-msg">{removedMsg}</div>}
      </div>
    )
  }

  return (
    <div className="cart-container">
      {/* Logo grande centrado y detrás */}
      <img src="/logo.png" alt="Logo" className="cart-logo-bg" width="300" height="100" />
      <h1 className="cart-title">Carrito de compra</h1>
      <div className="cart-content">
        {removedMsg && <div className="cart-removed-msg">{removedMsg}</div>}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item">
              <div className="cart-item-image">
                <img src={item.imageFront} alt={item.title} width="100" height="100" loading="lazy" />
              </div>
              
              <div className="cart-item-details">
                <h3 className="cart-item-title">{item.title}</h3>
                <p className="cart-item-info">
                  Color: <span>{item.color}</span> | Talla: <span>{item.size}</span>
                </p>
                <p className="cart-item-price">${item.price} UYU</p>
              </div>

              <div className="cart-item-quantity">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <div className="cart-item-total">
                <p>{(item.price * item.quantity).toFixed(0)} UYU</p>
              </div>

              <button
                className="cart-item-remove"
                onClick={() => handleRemove(item.id, item.size, item.color)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{getTotalPrice().toFixed(0)} UYU</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{getTotalPrice().toFixed(0)} UYU</span>
          </div>

          <div className="delivery-method">
            <span>Tipo de entrega:</span>
            <div className="delivery-options">
              <label>
                <input type="radio" name="deliveryType" value="envio" checked={deliveryType === 'envio'} onChange={() => setDeliveryType('envio')} />
                <span>Envío a domicilio</span>
              </label>
                <label>
                  <input type="radio" name="deliveryType" value="sucursal" checked={deliveryType === 'sucursal'} onChange={() => setDeliveryType('sucursal')} />
                  <span>Recogida en sucursal</span>
                </label>
            </div>
          </div>

          <div className="payment-method">
            <span>Método de pago:</span>
            <div className="payment-options">
              <label>
                <input type="radio" name="paymentType" value="paypal" checked={paymentType === 'paypal'} onChange={() => setPaymentType('paypal')} />
                <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="paypal-logo" width="64" height="64" />
                <span>PayPal</span>
              </label>
              <label style={{display: 'none'}}>
                <input type="radio" name="paymentType" value="mercadopago" checked={paymentType === 'mercadopago'} onChange={() => setPaymentType('mercadopago')} style={{display: 'none'}} />
                <img src="/mercadopago.svg" alt="MercadoPago" className="mp-logo" style={{display: 'none'}} />
                <span style={{display: 'none'}}>MercadoPago</span>
              </label>
              <label>
                  <input type="radio" name="paymentType" value="transferencia" checked={paymentType === 'transferencia'} onChange={() => setPaymentType('transferencia')} style={{display: 'none'}} />
                  <span className="bank-icon" style={{display: 'none'}}>🏦</span>
                  <span style={{display: 'none'}}>Transferencia bancaria</span>
                </label>
            </div>
          </div>

          <button className="checkout-btn" onClick={onCheckout}>
            Proceder al pago
          </button>

          <button className="clear-cart-btn" onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
