// Script para obtener Access Token de MercadoPago usando OAuth 2.0 con PKCE
import fetch from 'node-fetch';

const MP_CLIENT_ID = '4096647727026581'; // Public Key de MercadoPago
const MP_CLIENT_SECRET = 'TG-67557e1e73004a0001e5c29e-241983636';
const code = 'TG-67557e1e73004a0001e5c29e-241983636';
const code_verifier = '47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU';
const redirect_uri = 'http://localhost:5173'; // Debe ser el mismo que usaste en la autorización

async function getAccessToken() {
  try {
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: MP_CLIENT_ID,
        client_secret: MP_CLIENT_SECRET,
        code: code,
        code_verifier: code_verifier,
        redirect_uri: redirect_uri
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Access Token obtenido exitosamente:');
      console.log('Access Token:', data.access_token);
      console.log('Refresh Token:', data.refresh_token);
      console.log('Expira en:', data.expires_in, 'segundos');
      console.log('Scope:', data.scope);
      console.log('\n📝 Usa este Access Token en tu backend (variable de entorno MP_ACCESS_TOKEN)');
    } else {
      console.error('❌ Error al obtener Access Token:');
      console.error('Status:', response.status);
      console.error('Error:', data);
    }
  } catch (error) {
    console.error('❌ Error en la petición:', error.message);
  }
}

// Ejecutar el script
getAccessToken();