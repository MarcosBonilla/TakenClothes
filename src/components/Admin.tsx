import React, { useState } from 'react'
import { useEffect } from 'react'
import './Admin.css'



function Admin() {
  const [password, setPassword] = useState('');
  const [access, setAccess] = useState(() => {
    return localStorage.getItem('adminAccess') === 'true';
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [notif, setNotif] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('todos');

  const filteredOrders = filter === 'todos' ? orders : orders.filter(o => o.status.toLowerCase() === filter);
  const statusCounts = {
    pendiente: orders.filter(o => o.status.toLowerCase() === 'pendiente').length,
    confirmado: orders.filter(o => o.status.toLowerCase() === 'confirmado').length,
    completado: orders.filter(o => o.status.toLowerCase() === 'completado').length,
    cancelado: orders.filter(o => o.status.toLowerCase() === 'cancelado').length,
    total: orders.length
  };

  const fetchOrders = () => {
    fetch(`${import.meta.env.VITE_API_URL}/orders`)
      .then(res => res.json())
      .then(data => {
        const mapped = Array.isArray(data)
          ? data.reverse().map(o => ({
              id: o.id,
              name: o.cliente,
              email: o.email,
              phone: o.contacto,
              product: o.producto,
              size: o.talla,
              quantity: o.cantidad,
              payment: o.pago,
              delivery: o.entrega,
              status: o.status
            }))
          : [];
        setOrders(mapped);
      })
      .catch(() => {
        setOrders([]);
      });
  };

  useEffect(() => {
    if (access) {
      fetchOrders();
      const interval = setInterval(() => {
        fetchOrders();
      }, 20000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [access]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setAccess(true)
      localStorage.setItem('adminAccess', 'true');
    } else {
      setNotif('Contraseña incorrecta')
      setTimeout(() => setNotif(''), 1500)
    }
  }

  const handleStatus = (id: number, status: 'pendiente' | 'confirmado' | 'cancelado' | 'completado') => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
    
    fetch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    .then(res => {
      if (res.ok) {
        setToast('Estado actualizado correctamente')
      } else {
        setToast('Error al actualizar estado')
        // Revertir cambio local si falló
        fetchOrders();
      }
    })
    .catch(() => {
      setToast('Error al actualizar estado')
      // Revertir cambio local si falló
      fetchOrders();
    })
    .finally(() => {
      setTimeout(() => setToast(null), 2200)
    });
  }

  if (!access) {
    return (
      <div className="admin-bg">
        <div className="admin-login">
          <form onSubmit={handleLogin} className="admin-login-form">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña de administrador"
              className="admin-input"
            />
            <button type="submit" className="admin-btn">Acceder</button>
          </form>
          {notif && <div className="admin-notif">{notif}</div>}
        </div>
      </div>
    );
  }

  // ...existing code...
  return (
    <div className="admin-bg">
      <div className="admin-container">
        <h1>Panel de administración</h1>
        {notif && <div className="admin-notif">{notif}</div>}
        <div className="admin-status-bar">
          <select className="admin-select" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
          <div className="admin-status-cards">
            <div className="admin-status-card"><span className="admin-status-dot pendiente"></span>Pendiente<div className="admin-status-count">{statusCounts.pendiente}</div></div>
            <div className="admin-status-card"><span className="admin-status-dot confirmado"></span>Confirmado<div className="admin-status-count">{statusCounts.confirmado}</div></div>
            <div className="admin-status-card"><span className="admin-status-dot completado"></span>Completado<div className="admin-status-count">{statusCounts.completado}</div></div>
            <div className="admin-status-card"><span className="admin-status-dot cancelado"></span>Cancelado<div className="admin-status-count">{statusCounts.cancelado}</div></div>
            <div className="admin-status-card"><span className="admin-status-dot total"></span>Total<div className="admin-status-count">{statusCounts.total}</div></div>
          </div>
        </div>
        {toast && (
          <div className={`admin-toast${toast ? '' : ' hide'}`}>{toast}</div>
        )}
        <div className="admin-orders-list">
          {filteredOrders.map((order) => (
            <div className="admin-order-card" key={order.id}>
              <div className="admin-order-row"><span className="admin-label">Cliente:</span> {order.name}</div>
              <div className="admin-order-row"><span className="admin-label">Email:</span> {order.email}</div>
              <div className="admin-order-row"><span className="admin-label">Contacto:</span> {order.phone}</div>
              <div className="admin-order-row"><span className="admin-label">Producto:</span> {order.product}</div>
              <div className="admin-order-row"><span className="admin-label">Talla:</span> {order.size}</div>
              <div className="admin-order-row"><span className="admin-label">Cantidad:</span> {order.quantity}</div>
              <div className="admin-order-row"><span className="admin-label">Pago:</span> {order.payment}</div>
              <div className="admin-order-row"><span className="admin-label">Entrega:</span> {order.delivery === 'envio' ? 'Envío' : 'Sucursal'}</div>
              <div className="admin-order-row admin-actions">
                <select
                  className="admin-select"
                  value={order.status.toLowerCase()}
                  onChange={e => handleStatus(order.id, e.target.value as 'pendiente' | 'confirmado' | 'completado' | 'cancelado')}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin
