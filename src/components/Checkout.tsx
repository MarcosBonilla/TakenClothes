import './Checkout.css';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useRef } from 'react';

interface CheckoutProps {
  deliveryType?: 'envio' | 'sucursal';
  onOrderSuccess?: () => void;
  paymentType: 'paypal' | 'mercadopago' | 'transferencia';
}

function Checkout({ deliveryType = 'envio', onOrderSuccess, paymentType }: CheckoutProps) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    pago: paymentType // inicializa con el prop
  });

  // Sincroniza form.pago con paymentType
  useEffect(() => {
    setForm(f => ({ ...f, pago: paymentType }));
  }, [paymentType]);
  
  // Validar si el formulario está completo
  const isFormComplete = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) return false;
    if (deliveryType === 'envio' && (!form.address.trim() || !form.city.trim())) return false;
    if (form.phone.length !== 8) return false;
    return true;
  };
  
  const isCartNotEmpty = cartItems.length > 0;

  // Referencia para el contenedor del botón PayPal
  const paypalRef = useRef<HTMLDivElement>(null);
  const mercadoPagoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paypalRef.current || !isFormComplete()) return;
    paypalRef.current.innerHTML = '';
    // @ts-ignore
    if (!(window as any).paypal) {
      const script = document.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=AQ1vHpQS0cuRLOU4DFW23VYnK1iwGoFtf0-CYHD2O3cFg0NRvtEqqNoGo7ZY_RayWhIi63zu2G8sOa4q&currency=USD&enable-funding=paypal&disable-funding=card';
      script.async = true;
      script.onload = () => renderPayPalButton();
      document.body.appendChild(script);
    } else {
      renderPayPalButton();
    }
    function renderPayPalButton() {
      if (paypalRef.current) paypalRef.current.innerHTML = '';
      // @ts-ignore
      (window as any).paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
        funding: {
          // @ts-ignore
          disallowed: [(window as any).paypal.FUNDING.CARD]
        },
        createOrder: (_data: any, actions: any) => {
          // Conversión de UYU a USD
          const exchangeRate = 40; // 1 USD = 40 UYU
          const totalUYU = getTotalPrice();
          const totalUSD = (totalUYU / exchangeRate).toFixed(2);
          return actions.order.create({
            purchase_units: [{
              amount: { value: totalUSD }
            }]
          });
        },
        onApprove: async (_data: any, actions: any) => {
          await actions.order.capture();
          Promise.all(
            cartItems.map(item =>
              fetch(`${import.meta.env.VITE_API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  cliente: form.name,
                  email: form.email,
                  contacto: form.phone,
                  producto: item.title,
                  talla: item.size,
                  cantidad: item.quantity,
                  pago: 'paypal',
                  entrega: deliveryType,
                  status: 'pendiente'
                })
              })
            )
          ).then(() => {
            clearCart();
            localStorage.setItem('orderCreated', Date.now().toString());
            window.dispatchEvent(new Event('orderCreated'));
            if (onOrderSuccess) onOrderSuccess();
          });
        },
        onError: (_err: any) => {
          setErrorMsg('Error en el pago con PayPal');
          setTimeout(() => setErrorMsg(''), 3000);
        }
      }).render(paypalRef.current);
    }
    return () => {
      if (paypalRef.current) paypalRef.current.innerHTML = '';
    };
  }, [cartItems, getTotalPrice, form, deliveryType, onOrderSuccess, clearCart, isFormComplete]);

  // MercadoPago Button - Simulado para testing
  useEffect(() => {
    if (!mercadoPagoRef.current || form.pago !== 'mercadopago') return;
    mercadoPagoRef.current.innerHTML = '';
    
    // Crear botón de prueba mientras no tenemos credenciales reales
    const testButton = document.createElement('div');
    testButton.style.cssText = `
      width: 100%;
      padding: 12px;
      background: #009ee3;
      color: white;
      text-align: center;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      margin-top: 10px;
    `;
    testButton.textContent = 'Pagar con MercadoPago (Demo)';
    
    testButton.onclick = () => {
      // Simular flujo de pago exitoso
      Promise.all(
        cartItems.map(item =>
          fetch('http://localhost:4000/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cliente: form.name,
              email: form.email,
              contacto: form.phone,
              producto: item.title,
              talla: item.size,
              cantidad: item.quantity,
              pago: 'mercadopago',
              entrega: deliveryType,
              status: 'pendiente'
            })
          })
        )
      ).then(() => {
        clearCart();
        localStorage.setItem('orderCreated', Date.now().toString());
        window.dispatchEvent(new Event('orderCreated'));
        if (onOrderSuccess) onOrderSuccess();
      }).catch(error => {
        console.error('Error guardando pedido:', error);
        setErrorMsg('Error procesando el pedido');
        setTimeout(() => setErrorMsg(''), 3000);
      });
    };
    
    mercadoPagoRef.current.appendChild(testButton);
    
    return () => {
      if (mercadoPagoRef.current) mercadoPagoRef.current.innerHTML = '';
    };
  }, [cartItems, form, deliveryType, onOrderSuccess, clearCart]);
  // ...existing code...

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || (deliveryType === 'envio' && (!form.address || !form.city))) {
      setErrorMsg('Por favor, completa todos los campos requeridos');
      setTimeout(() => setErrorMsg(''), 2000);
      return;
    }
    // Aquí iría la lógica de envío si se implementa otro método de pago (ej: transferencia)
  }

  return (
    <div className="checkout-container" style={{marginTop: '3.5em'}}>
      <div className="checkout-content">
        <h1 className="checkout-title">Finalizar compra</h1>
        <div className="checkout-summary">
          <h2>Resumen del pedido</h2>
          <ul className="checkout-list">
            {cartItems.map(item => (
              <li key={`${item.id}-${item.size}-${item.color}`} className="checkout-item">
                <span className="checkout-product">{item.title} ({item.color}, {item.size})</span>
                <span className="checkout-qty">x{item.quantity}</span>
                <span className="checkout-price">{(item.price * item.quantity).toFixed(0)} UYU</span>
              </li>
            ))}
          </ul>
          <div className="checkout-total">
            <span>Subtotal:</span>
            <span>{getTotalPrice().toFixed(0)} UYU</span>
          </div>
          {deliveryType === 'envio' && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.8rem', 
              background: '#f8f9fa', 
              borderRadius: '6px',
              fontSize: '0.9rem',
              color: '#555',
              borderLeft: '3px solid #667eea'
            }}>
              <strong>📦 Envío:</strong> Entre $200 - $300 UYU<br />
              <small style={{ color: '#777' }}>Se abona a la empresa de envíos al recibir el producto</small>
            </div>
          )}
        </div>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>{deliveryType === 'envio' ? 'Datos de envío' : 'Datos de contacto'}</h2>
          <input type="text" name="name" placeholder="Nombre completo" value={form.name} onChange={handleInput} required />
          <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleInput} required />
          {deliveryType === 'envio' && (
            <>
              <input type="text" name="address" placeholder="Dirección" value={form.address} onChange={handleInput} required />
              <input type="text" name="city" placeholder="Ciudad" value={form.city} onChange={handleInput} required />
            </>
          )}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
            <img src="/uy.png" alt="Uruguay" style={{ width: '24px', height: '18px', marginRight: '0.7em', borderRadius: '3px', boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }} />
            <span style={{ marginRight: '0.7em', fontWeight: 'bold', fontSize: '1.08em' }}>+598</span>
            <input
              type="text"
              name="phone"
              placeholder="8 dígitos"
              value={form.phone}
              onChange={handleInput}
              required
              maxLength={8}
              pattern="\d{8}"
              style={{
                width: '100%',
                minWidth: '220px',
                padding: '1rem 1.2rem',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '1.08rem',
                background: '#fafafa',
                color: '#222',
                boxSizing: 'border-box'
              }}
            />
          </div>
          {/* Botón PayPal solo si selecciona PayPal y el formulario está completo */}
          {isCartNotEmpty && form.pago === 'paypal' && isFormComplete() && <div ref={paypalRef} style={{ marginTop: '1.5rem' }} />}
          {isCartNotEmpty && form.pago === 'paypal' && !isFormComplete() && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f0f0', borderRadius: '6px', textAlign: 'center', color: '#666' }}>
              Completa todos los datos para ver las opciones de pago
            </div>
          )}
          {/* Botón MercadoPago solo si selecciona MercadoPago */}
          {isCartNotEmpty && form.pago === 'mercadopago' && <div ref={mercadoPagoRef} style={{ marginTop: '1.5rem' }} />}
        </form>
        {errorMsg && (
          <div className="cart-error">
            {errorMsg}
          </div>
        )}
        <div className="checkout-paypal">
        </div>
      </div>
    </div>
  )
}

export default Checkout
