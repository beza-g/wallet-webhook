// send_test.js
const axios = require('axios');
const crypto = require('crypto');

const SECRET = process.env.YAYA_WEBHOOK_SECRET;
const URL = process.env.WEBHOOK_URL || 'http://localhost:3000/webhook';

(async () => {
  const payload = {
    id: "qwerty123456",
    amount: 90,
    currency: "ETB",
    created_at_time: 1673381836,
    timestamp: Math.floor(Date.now()/1000),
    cause: "Testing",
    full_name: "Bezawit Getu",
    account_name: "bezagetu",
    invoice_url: "https://yayawallet.com/en/invoice/xxx"
  };

  const fields = ['id','amount','currency','created_at_time','timestamp','cause','full_name','account_name','invoice_url'];
  const dataToSign = fields.map(f => String(payload[f] ?? '')).join('');
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(Buffer.from(dataToSign, 'utf8'));
  const signature = hmac.digest('hex');

  try {
    const res = await axios.post(URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'YAYA-SIGNATURE': signature
      },
      timeout: 5000
    });
    console.log('Response status:', res.status, res.statusText);
    console.log('Response body:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Error response:', err.response.status, err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
  }
})();
