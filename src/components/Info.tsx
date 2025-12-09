import './Info.css'

function Info() {
  return (
    <div className="info-container">
      {/* Logo grande centrado y detrás */}
      <img src="/logo.png" alt="Logo" className="info-logo-bg" width="300" height="100" />
      <div className="info-content">
        <h1 className="info-title">Sobre la marca</h1>
        <p className="info-date">Fundada en 2023</p>
        <p className="info-description">
          Shop Dropping nació con la idea de redefinir la moda urbana, apostando por la simplicidad y la calidad. Nuestra misión es ofrecer prendas minimalistas, cómodas y atemporales, pensadas para quienes buscan destacar sin excesos.
        </p>
        <p className="info-commercial">
          Creemos que la ropa debe ser una extensión de tu personalidad, no un disfraz. Por eso, cada pieza está diseñada para acompañarte en tu día a día, con materiales premium y detalles cuidados. Buscamos la excelencia en cada colección y la satisfacción de quienes confían en nosotros.
        </p>
        <p className="info-search">
          Si eres de los que buscan ropa auténtica, funcional y con estilo propio, Shop Dropping es tu lugar. Únete a nuestra comunidad y descubre una nueva forma de vestir.
        </p>
      </div>
    </div>
  )
}

export default Info
