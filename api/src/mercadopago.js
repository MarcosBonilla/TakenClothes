const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

let accessToken = null;
let tokenExpiry = null;

// Refrescar Access Token de MercadoPago
async function refreshAccessToken() {
    try {
        const response = await fetch('https://api.mercadopago.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.MERCADOPAGO_CLIENT_ID,
                client_secret: process.env.MERCADOPAGO_CLIENT_SECRET,
            }),
        });

        const data = await response.json();
        
        if (data.access_token) {
            accessToken = data.access_token;
            tokenExpiry = Date.now() + (data.expires_in * 1000);
            console.log('✅ MercadoPago token refreshed');
            return accessToken;
        } else {
            throw new Error('Failed to get access token');
        }
    } catch (error) {
        console.error('❌ Error refreshing MercadoPago token:', error);
        throw error;
    }
}

// Obtener token válido
async function getAccessToken() {
    if (!accessToken || Date.now() >= tokenExpiry) {
        return await refreshAccessToken();
    }
    return accessToken;
}

// Crear preferencia de pago
router.post('/create-preference', async (req, res) => {
    try {
        const { items, payer } = req.body;
        const token = await getAccessToken();

        const preference = {
            items: items.map(item => ({
                title: item.name,
                quantity: item.quantity,
                unit_price: parseFloat(item.price),
                currency_id: 'UYU',
            })),
            payer: {
                name: payer.name,
                email: payer.email,
                phone: payer.phone ? {
                    number: payer.phone
                } : undefined,
                address: payer.address ? {
                    street_name: payer.address
                } : undefined,
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/checkout?status=success`,
                failure: `${process.env.FRONTEND_URL}/checkout?status=failure`,
                pending: `${process.env.FRONTEND_URL}/checkout?status=pending`,
            },
            auto_return: 'approved',
            statement_descriptor: 'Shop Dropshipping',
        };

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(preference),
        });

        const data = await response.json();

        if (response.status === 401) {
            console.log('Token expired, refreshing...');
            accessToken = null;
            return router.post('/create-preference')(req, res);
        }

        if (data.id) {
            res.json({
                id: data.id,
                init_point: data.init_point,
            });
        } else {
            console.error('MercadoPago error:', data);
            res.status(500).json({ error: 'Failed to create preference', details: data });
        }
    } catch (error) {
        console.error('Error creating MercadoPago preference:', error);
        res.status(500).json({ error: 'Failed to create preference' });
    }
});

// Verificar estado de pago
router.get('/payment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const token = await getAccessToken();

        const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error getting payment info:', error);
        res.status(500).json({ error: 'Failed to get payment info' });
    }
});

module.exports = router;