const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Generar Access Token de PayPal
async function generateAccessToken() {
    const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const data = await response.json();
    return data.access_token;
}

// Crear orden de PayPal
router.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        const accessToken = await generateAccessToken();

        const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: amount,
                        },
                    },
                ],
            }),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error creating PayPal order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Capturar pago de PayPal
router.post('/capture-order', async (req, res) => {
    try {
        const { orderID } = req.body;
        const accessToken = await generateAccessToken();

        const response = await fetch(
            `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error capturing PayPal order:', error);
        res.status(500).json({ error: 'Failed to capture order' });
    }
});

module.exports = router;