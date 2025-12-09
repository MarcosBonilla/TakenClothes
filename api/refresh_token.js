// Script para obtener Access Token usando Refresh Token
import fetch from 'node-fetch';

const MP_CLIENT_ID = '4096647727026581';
const MP_CLIENT_SECRET = 'TG-67557e1e73004a0001e5c29e-241983636';
const MP_REFRESH_TOKEN = 'TG-67557e1e73004a0001e5c29e-241983636';

async function refreshAccessToken() {
  try {
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: MP_CLIENT_ID,
        client_secret: MP_CLIENT_SECRET,
        code: MP_REFRESH_TOKEN,
        code_verifier: '47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU',
        redirect_uri: 'http://localhost:5173',
        refresh_token: MP_REFRESH_TOKEN,
        test_token: 'false'
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Access Token obtenido exitosamente:');
      console.log('Access Token:', data.access_token);
      console.log('Refresh Token:', data.refresh_token || 'No actualizado');
      console.log('Expira en:', data.expires_in, 'segundos');
      console.log('\n📝 Actualiza estas variables en mercadopago.js:');
      console.log(`MP_ACCESS_TOKEN = '${data.access_token}'`);
      if (data.refresh_token) {
        console.log(`MP_REFRESH_TOKEN = '${data.refresh_token}'`);
      }
    } else {
      console.error('❌ Error al obtener Access Token:');
      console.error('Status:', response.status);
      console.error('Error:', data);
    }
  } catch (error) {
    console.error('❌ Error en la petición:', error.message);
  }
}

refreshAccessToken();
