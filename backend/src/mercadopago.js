import { MercadoPagoConfig, Preference } from 'mercadopago';
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// Configuración de credenciales
const MP_CLIENT_ID = process.env.MP_CLIENT_ID || '4096647727026581';
const MP_CLIENT_SECRET = process.env.MP_CLIENT_SECRET || 'TG-67557e1e73004a0001e5c29e-241983636';
let MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'TEST-4096647727026581-120809-45c79011a675e2995692317f833a7f90-448311454';
let MP_REFRESH_TOKEN = process.env.MP_REFRESH_TOKEN || 'TG-67557e1e73004a0001e5c29e-241983636';

// Inicializar cliente de MercadoPago
let client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
let preferenceClient = new Preference(client);

// Función para renovar el Access Token
async function refreshAccessToken() {
  try {
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: MP_CLIENT_ID,
        client_secret: MP_CLIENT_SECRET,
        refresh_token: MP_REFRESH_TOKEN
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      MP_ACCESS_TOKEN = data.access_token;
      MP_REFRESH_TOKEN = data.refresh_token || MP_REFRESH_TOKEN;
      // Reinicializar cliente con nuevo token
      client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
      preferenceClient = new Preference(client);
      console.log('✅ Access Token renovado exitosamente');
      return true;
    } else {
      console.error('❌ Error renovando token:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error en renovación de token:', error.message);
    return false;
  }
}

// Configura el Access Token inicial (no es necesario con el nuevo SDK)

// NOTA: La renovación automática está deshabilitada para tokens de prueba
// Renovar token automáticamente cada 5 minutos (solo para producción con OAuth)
// setInterval(async () => {
//   console.log('🔄 Renovación automática del token programada...');
//   await refreshAccessToken();
// }, 5 * 60 * 1000); // 5 minutos

// Renovar token al iniciar si es necesario (deshabilitado para tokens de prueba)
// (async () => {
//   console.log('🚀 Verificando token inicial...');
//   await refreshAccessToken();
// })();

// Middleware para manejar errores de token expirado
async function handleTokenExpired(error, req, res, next) {
  if (error.status === 401 || error.message?.includes('invalid_token')) {
    console.log('🔄 Token expirado, intentando renovar...');
    const renewed = await refreshAccessToken();
    if (renewed) {
      // Reintenta la operación original
      return next();
    }
  }
  throw error;
}

router.post('/create_preference', async (req, res) => {
  try {
    const { items, payer } = req.body;
    const preference = {
      items,
      payer,
      back_urls: {
        success: 'http://localhost:5173/checkout',
        failure: 'http://localhost:5173/checkout',
        pending: 'http://localhost:5173/checkout'
      },
      auto_return: 'approved'
    };
    
    const response = await preferenceClient.create({ body: preference });
    res.json({ id: response.id });
  } catch (error) {
    // Intenta renovar token si expiró
    if (error.status === 401 || error.message?.includes('invalid_token')) {
      console.log('🔄 Token expirado, renovando y reintentando...');
      const renewed = await refreshAccessToken();
      if (renewed) {
        try {
          const { items, payer } = req.body;
          const preference = {
            items,
            payer,
            back_urls: {
              success: 'http://localhost:5173/checkout',
              failure: 'http://localhost:5173/checkout',
              pending: 'http://localhost:5173/checkout'
            },
            auto_return: 'approved'
          };
          const response = await preferenceClient.create({ body: preference });
          return res.json({ id: response.id });
        } catch (retryError) {
          return res.status(500).json({ error: 'Error tras renovar token: ' + retryError.message });
        }
      }
    }
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para renovar manualmente el token (opcional)
router.post('/refresh_token', async (req, res) => {
  const renewed = await refreshAccessToken();
  if (renewed) {
    res.json({ success: true, message: 'Token renovado exitosamente' });
  } else {
    res.status(500).json({ success: false, message: 'Error renovando token' });
  }
});

export default router;
