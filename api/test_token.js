// Script para verificar que el Access Token funciona
import { MercadoPagoConfig, Preference } from 'mercadopago';

const MP_ACCESS_TOKEN = 'TEST-4096647727026581-120809-45c79011a675e2995692317f833a7f90-448311454';

async function testAccessToken() {
  try {
    console.log('🔍 Probando Access Token...');
    
    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const preferenceClient = new Preference(client);
    
    // Crear una preferencia de prueba
    const testPreference = {
      items: [
        {
          title: 'Test Product',
          quantity: 1,
          unit_price: 100
        }
      ],
      back_urls: {
        success: 'http://localhost:5173/success',
        failure: 'http://localhost:5173/failure',
        pending: 'http://localhost:5173/pending'
      }
    };
    
    const response = await preferenceClient.create({ body: testPreference });
    
    console.log('✅ Access Token válido!');
    console.log('Preference ID:', response.id);
    console.log('Init Point:', response.init_point);
    console.log('\n✨ MercadoPago está funcionando correctamente');
  } catch (error) {
    console.error('❌ Error al probar Access Token:');
    console.error('Mensaje:', error.message);
    console.error('Status:', error.status);
  }
}

testAccessToken();
