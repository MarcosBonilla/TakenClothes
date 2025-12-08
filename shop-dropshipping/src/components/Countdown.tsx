import { useState, useEffect } from 'react'
import './Countdown.css'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function Countdown() {
  const targetDate = new Date('2025-12-06T12:00:00').getTime()
  
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime()
    const difference = targetDate - now

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    }
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const isCountdownFinished = 
    timeLeft.days === 0 && 
    timeLeft.hours === 0 && 
    timeLeft.minutes === 0 && 
    timeLeft.seconds === 0

  if (isCountdownFinished) {
    return (
      <div className="countdown-container">
        <div className="countdown-content">
          <h1 className="countdown-finished">¡El lanzamiento ha comenzado!</h1>
          <p className="countdown-subtitle">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="countdown-container">
      <div className="countdown-content">
        <h1 className="countdown-heading">Próximo lanzamiento</h1>
        <p className="countdown-date">6 de Diciembre, 2025 - 12:00 PM</p>
        
        <div className="countdown-timer">
          <div className="time-unit">
            <div className="time-value">{String(timeLeft.days).padStart(2, '0')}</div>
            <div className="time-label">Días</div>
          </div>
          
          <div className="time-separator">:</div>
          
          <div className="time-unit">
            <div className="time-value">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="time-label">Horas</div>
          </div>
          
          <div className="time-separator">:</div>
          
          <div className="time-unit">
            <div className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="time-label">Minutos</div>
          </div>
          
          <div className="time-separator">:</div>
          
          <div className="time-unit">
            <div className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="time-label">Segundos</div>
          </div>
        </div>

        <div className="countdown-message">
          <p>Mantente atento para nuestro lanzamiento exclusivo</p>
        </div>
      </div>
    </div>
  )
}

export default Countdown
