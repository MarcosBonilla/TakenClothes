import './DropEnded.css'
import { useState } from 'react'

function DropEnded() {
  const [input, setInput] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(input)) {
      setErrorMsg('Ingresa un email válido')
      setTimeout(() => setErrorMsg(''), 2000)
      return
    }
    setErrorMsg('')
    setSuccessMsg('¡Te has suscrito correctamente!')
    setInput('')
    setTimeout(() => setSuccessMsg(''), 2000)
  }

  return (
    <div className="drop-ended-container">
      <div className="drop-ended-content">
        <h1 className="drop-ended-title">¡El stock del drop se ha agotado!</h1>
        <p className="drop-ended-subtitle">Gracias por tu interés y por ser parte de Shop Dropping.</p>
        <div className="drop-ended-message">
          <p>Pronto anunciaremos la fecha del próximo drop.<br />
          Síguenos en redes sociales y suscríbete para recibir novedades.</p>
        </div>
        <form className="drop-ended-form" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Ingresa tu email para novedades"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="drop-ended-input"
            required
          />
          <button type="submit" className="drop-ended-btn">Suscribirme</button>
        </form>
        {errorMsg && <div className="drop-ended-error">{errorMsg}</div>}
        {successMsg && <div className="drop-ended-success">{successMsg}</div>}
        <div className="drop-ended-socials">
          <a href="https://instagram.com" target="_blank" rel="noopener" className="drop-ended-social" aria-label="Instagram">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#fff"/>
              <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="#fff"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="#fff"/>
            </svg>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener" className="drop-ended-social" aria-label="TikTok">
            <svg viewBox="0 0 32 32"><path d="M22.5 7.5c-.2-1.1-.3-2.2-.3-3.3h-4.2v18.2c0 1.2-.9 2.2-2.1 2.2s-2.1-1-2.1-2.2c0-1.2 1-2.2 2.1-2.2.3 0 .6.1.9.2v-4.1c-.3 0-.6-.1-.9-.1-3.5 0-6.3 2.8-6.3 6.3s2.8 6.3 6.3 6.3c3.5 0 6.3-2.8 6.3-6.3V11.2c1 .7 2.2 1.1 3.5 1.1V7.5h-2.2z"/></svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default DropEnded
