import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import './ProductDetail.css'

interface ProductDetailProps {
  product: {
    id: number;
    title: string;
    price: number;
    imageFront: string;
    imageBack: string;
    colors: string[];
    sizes: string[];
  };
  onBack: () => void;
  onGoToCart?: () => void;
}

function ProductDetail({ product, onBack, onGoToCart }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [currentImage, setCurrentImage] = useState<'front' | 'back'>('front')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [stock, setStock] = useState<Record<string, number>>({})
  const { addToCart } = useCart()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": [product.imageFront, product.imageBack],
    "description": `Campera ${product.title} - ${product.colors.join(', ')} - Talles: ${product.sizes.join(', ')}`,
    "brand": {
      "@type": "Brand",
      "name": "Shop Dropping"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "UYU",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    }
  };

  // Consultar stock al montar el componente
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/orders/stock?producto=${encodeURIComponent(product.title)}`)
      .then(res => res.json())
      .then(data => {
        // data: [{ talla: 'XS/S', cantidad: 5 }, ...]
        const stockMap: Record<string, number> = {}
        data.forEach((item: { talla: string, cantidad: number }) => {
          stockMap[item.talla] = item.cantidad
        })
        setStock(stockMap)
      })
      .catch(() => setStock({}))
  }, [product.title])

  const handleAddToCart = () => {
    if (!selectedSize) {
      setErrorMsg('Necesitas seleccionar una talla')
      setTimeout(() => setErrorMsg(''), 2000)
      return
    }
    if (stock[selectedSize] === 0 || stock[selectedSize] === undefined) {
      setErrorMsg('No hay stock disponible para esta talla')
      setTimeout(() => setErrorMsg(''), 2000)
      return
    }
    setErrorMsg('')
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageFront: product.imageFront,
      size: selectedSize,
      color: product.colors[0],
    })
    setShowConfirmation(true)
    setTimeout(() => setShowConfirmation(false), 2000)
  }
  // Verificar si todas las tallas están sin stock
  const allOutOfStock = product.sizes.every((size: string) => stock[size] === 0 || stock[size] === undefined)

  return (
    <div className="product-detail">
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      {/* Header con botón volver */}
      <header className="detail-header">
        <button className="back-button" onClick={onBack}>
          ← Volver
        </button>
      </header>

      <div className="detail-container">
        {/* Galería de imágenes */}
        <div className="detail-gallery">
          <div className="main-image">
            <img 
              src={currentImage === 'front' ? product.imageFront : product.imageBack}
              alt={product.title}
              className="detail-main-img"
            />
          </div>
          <div className="thumbnail-list">
            <div 
              className={`thumbnail ${currentImage === 'front' ? 'active' : ''}`}
              onClick={() => setCurrentImage('front')}
            >
              <img src={product.imageFront} alt="Frontal" />
            </div>
            <div 
              className={`thumbnail ${currentImage === 'back' ? 'active' : ''}`}
              onClick={() => setCurrentImage('back')}
            >
              <img src={product.imageBack} alt="Trasera" />
            </div>
          </div>
        </div>

        {/* Información del producto */}
        <div className="detail-info">
          <h1 className="detail-title">{product.title}</h1>
          <p className="detail-price">${product.price} UYU</p>

          {/* Selector de talla */}
          <div className="selector-group">
            <label className="selector-label">Talla</label>
            <div className="size-options">
              {product.sizes.map((size: string) => {
                const isOutOfStock = stock[size] === 0 || stock[size] === undefined
                return (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                    disabled={isOutOfStock || allOutOfStock}
                    style={isOutOfStock || allOutOfStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    title={isOutOfStock ? 'Sin stock' : ''}
                  >
                    {size}
                    {isOutOfStock && (
                      <span
                        style={{
                          color: '#ff5252',
                          fontSize: '0.6em',
                          marginLeft: 0,
                          display: 'block',
                          lineHeight: 1,
                          marginTop: 2,
                          wordBreak: 'break-word',
                          textAlign: 'center',
                          maxWidth: '100%'
                        }}
                      >
                        Sin stock
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Botón de compra */}
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={allOutOfStock}
            style={allOutOfStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            {allOutOfStock ? 'Sin stock disponible' : 'Añadir al carrito'}
          </button>
          {allOutOfStock && (
            <div className="cart-error" style={{ marginTop: '1rem' }}>
              No hay stock disponible para este producto.
            </div>
          )}
          <button className="go-to-cart-btn" onClick={() => onGoToCart && onGoToCart()}>
            Ir al carrito
          </button>

          {/* Mensaje de error */}
          {errorMsg && (
            <div className="cart-error">
              {errorMsg}
            </div>
          )}

          {/* Confirmación */}
          {showConfirmation && (
            <div className="cart-confirmation">
              ✓ Producto añadido al carrito
            </div>
          )}


          {/* Información adicional */}
          <div className="product-description">
            <h3>Descripción</h3>
            <p>Camiseta de algodón 100% con diseño minimalista. Corte regular y acabado de alta calidad.</p>
            <ul>
              <li>100% Algodón orgánico</li>
              <li>Lavado a máquina</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
