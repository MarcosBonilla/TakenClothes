import { useState, lazy, Suspense } from 'react'
import './App.css'
import { useCart } from './context/CartContext'

// Lazy loading de componentes pesados
const ProductDetail = lazy(() => import('./components/ProductDetail'))
const Cart = lazy(() => import('./components/Cart'))
const Countdown = lazy(() => import('./components/Countdown'))
const Info = lazy(() => import('./components/Info'))
const Checkout = lazy(() => import('./components/Checkout'))
const DropEnded = lazy(() => import('./components/DropEnded'))
const Admin = lazy(() => import('./components/Admin'))
const OrderSuccess = lazy(() => import('./components/OrderSuccess'))

interface Product {
  id: number
  title: string
  price: number
  imageFront: string
  imageBack: string
  category: string
  colors: string[]
  sizes: string[]
}

const products: Product[] = [
  {
    id: 1,
    title: 'Taken Azul',
    price: 2990,
    imageFront: '/products/camperas/azul1.webp',
    imageBack: '/products/camperas/azul2.webp',
    category: 'camperas',
    colors: ['Azul'],
    sizes: ['XS/S', 'M/L', 'XL']
  },
  {
    id: 2,
    title: 'Taken Negra',
    price: 2990,
    imageFront: '/products/camperas/negra1.webp',
    imageBack: '/products/camperas/negra2.webp',
    category: 'camperas',
    colors: ['Negra'],
    sizes: ['XS/S', 'M/L', 'XL']
  },
  {
    id: 3,
    title: 'Taken Rosa',
    price: 2990,
    imageFront: '/products/camperas/rosa1.webp',
    imageBack: '/products/camperas/rosa2.webp',
    category: 'camperas',
    colors: ['Rosa'],
    sizes: ['XS/S', 'M/L', 'XL']
  }
]

function App() {
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showCountdown] = useState(false)
  const [fade, setFade] = useState(false)
  const [deliveryType, setDeliveryType] = useState<'envio' | 'sucursal'>('envio')
  const [paymentType, setPaymentType] = useState<'paypal' | 'mercadopago' | 'transferencia'>('paypal')
  const { getTotalItems } = useCart()

  const navItems = ['home', 'carrito', 'info']

  // Función para manejar cualquier navegación con fade
  const handleSectionChange = (section: string) => {
    setFade(true)
    setTimeout(() => {
      setSelectedProduct(null)
      setActiveSection(section)
      setFade(false)
    }, 350)
  }

  const handleProductClick = (product: Product) => {
    setFade(true)
    setTimeout(() => {
      setSelectedProduct(product)
      setFade(false)
    }, 350)
  }

  const handleBackToHome = () => {
    setFade(true)
    setTimeout(() => {
      setSelectedProduct(null)
      setActiveSection('home')
      setFade(false)
    }, 350)
  }

  const handleGoToCart = () => {
    setFade(true)
    setTimeout(() => {
      setSelectedProduct(null)
      setActiveSection('carrito')
      setFade(false)
    }, 350)
  }


  // Ruta especial para countdown (accesible directamente)
  // Para acceder: añadir ?countdown=true en la URL
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('countdown') === 'true' || showCountdown) {
    return (
      <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Cargando...</div>}>
        <Countdown />
      </Suspense>
    )
  }

  // Ruta especial para drop terminado (accesible directamente)
  if (urlParams.get('drop') === 'ended') {
    return (
      <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Cargando...</div>}>
        <DropEnded />
      </Suspense>
    )
  }

  // Ruta especial para admin (accesible directamente)
  if (window.location.pathname === '/admin') {
    return (
      <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Cargando...</div>}>
        <Admin />
      </Suspense>
    )
  }


  // Si hay un producto seleccionado, mostrar la página de detalle
  if (selectedProduct) {
    return (
      <div className={`fade-wrapper${fade ? ' fade-out' : ''}`}>
        <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Cargando...</div>}>
          <ProductDetail product={selectedProduct} onBack={handleBackToHome} onGoToCart={handleGoToCart} />
        </Suspense>
      </div>
    )
  }

  // Si la sección activa es carrito, mostrar el carrito
  if (activeSection === 'carrito') {
    return (
      <div className={`fade-wrapper${fade ? ' fade-out' : ''}`}>
        <header className="header">
          <div className="header-logo-nav">
            <img src="/logo.png" alt="Logo" className="header-logo" />
            <nav className="nav">
              {navItems.map(item => (
                <div
                  key={item}
                  className={`nav-item ${activeSection === item ? 'active' : ''}`}
                  onClick={() => handleSectionChange(item)}
                >
                  {item}
                  {item === 'carrito' && getTotalItems() > 0 && (
                    <span className="cart-badge">{getTotalItems()}</span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </header>
        <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Cargando...</div>}>
          <Cart
            onCheckout={() => handleSectionChange('checkout')}
            deliveryType={deliveryType}
            setDeliveryType={setDeliveryType}
            paymentType={paymentType}
            setPaymentType={setPaymentType}
          />
        </Suspense>
      </div>
    )
  }

  // Si la sección activa es info, mostrar la página de información
  if (activeSection === 'info') {
    return (
      <div className={`fade-wrapper${fade ? ' fade-out' : ''}`}>
        <header className="header">
          <div className="header-logo-nav">
            <img src="/logo.png" alt="Logo" className="header-logo" />
            <nav className="nav">
              {navItems.map(item => (
                <div
                  key={item}
                  className={`nav-item ${activeSection === item ? 'active' : ''}`}
                  onClick={() => handleSectionChange(item)}
                >
                  {item}
                  {item === 'carrito' && getTotalItems() > 0 && (
                    <span className="cart-badge">{getTotalItems()}</span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </header>
        <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Cargando...</div>}>
          <Info />
        </Suspense>
      </div>
    )
  }

  // Pantalla de éxito tras pedido
  if (orderSuccess) {
    return (
      <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Cargando...</div>}>
        <OrderSuccess onBackToHome={() => {
          setOrderSuccess(false)
          setActiveSection('home')
        }} />
      </Suspense>
    )
  }

  // Si la sección activa es checkout, mostrar la página de pago
  if (activeSection === 'checkout') {
      return (
        <div className={`fade-wrapper${fade ? ' fade-out' : ''}`}>
          <header className="header">
            <div className="header-logo-nav">
              <img src="/logo.png" alt="Logo" className="header-logo" />
              <nav className="nav">
                {navItems.map(item => (
                  <div
                    key={item}
                    className={`nav-item ${activeSection === item ? 'active' : ''}`}
                    onClick={() => handleSectionChange(item)}
                  >
                    {item}
                    {item === 'carrito' && getTotalItems() > 0 && (
                      <span className="cart-badge">{getTotalItems()}</span>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </header>
          <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Cargando...</div>}>
            <Checkout deliveryType={deliveryType} onOrderSuccess={() => setOrderSuccess(true)} paymentType={paymentType} />
          </Suspense>
        </div>
      )
  }

  return (
    <div className={`fade-wrapper${fade ? ' fade-out' : ''}`}>
      {/* Header solo en pantallas principales */}
      <header className="header">
        <div className="header-logo-nav">
          <img src="/logo.png" alt="Logo" className="header-logo" width="120" height="40" />
          <nav className="nav">
            {navItems.map(item => (
              <div
                key={item}
                className={`nav-item ${activeSection === item ? 'active' : ''}`}
                onClick={() => handleSectionChange(item)}
              >
                {item}
                {item === 'carrito' && getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>
      {/* Products Grid */}
      <main className="products-container">
        <h1 className="main-title visually-hidden">Shop Dropping - Camperas urbanas minimalistas</h1>
        <div className="products-grid">
          {products.map(product => {
            let shadowClass = '';
            if (product.title.toLowerCase().includes('azul')) shadowClass = 'product-shadow-azul';
            else if (product.title.toLowerCase().includes('negra')) shadowClass = 'product-shadow-negra';
            else if (product.title.toLowerCase().includes('rosa')) shadowClass = 'product-shadow-rosa';
            return (
              <article 
                key={product.id} 
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                <div className={`product-image-container ${shadowClass}`}> 
                  <img 
                    src={product.imageFront} 
                    alt={product.title}
                    className="product-image product-image-front"
                    width="400"
                    height="400"
                    loading="lazy"
                  />
                  <img 
                    src={product.imageBack} 
                    alt={`${product.title} - Back`}
                    className="product-image product-image-back"
                    width="400"
                    height="400"
                    loading="lazy"
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">${product.price} UYU</p>
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default App
