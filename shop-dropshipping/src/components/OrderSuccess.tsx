
import './OrderSuccess.css';

const OrderSuccess = ({ onBackToHome }: { onBackToHome: () => void }) => {
  return (
    <div className="order-success-container">
      <div className="order-success-content">
        <h1 className="order-success-title">¡Pedido realizado con éxito!</h1>
        <p className="order-success-subtitle">Gracias por tu compra y por confiar en Shop Dropping.</p>
        <div className="order-success-message">
          <p>Pronto nos comunicaremos contigo para coordinar la entrega.<br />
          Si tienes dudas, puedes contactarnos por redes sociales.</p>
        </div>
        <button className="order-success-btn" onClick={onBackToHome}>Volver a la página principal</button>
      </div>
    </div>
  );
};

export default OrderSuccess;
