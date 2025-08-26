// Importing required modules
require('dotenv').config();
const express = require('express');
const crypto = require('crypto');

//App setup and config constants
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.YAYA_WEBHOOK_SECRET;
const TIMESTAMP_TOLERANCE_SEC = 300;

// Capturing raw body for signature verification
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf.toString(); }
}));

// Defining the webhook endpoint
app.post('/webhook', (req, res) => {
  const signature = req.get('YAYA-SIGNATURE');
  if (!signature) return res.status(400).send('Missing YAYA-SIGNATURE header');

  const payload = req.body;
  const { timestamp } = payload;
  const nowSec = Math.floor(Date.now() / 1000);

  if (typeof timestamp !== 'number' || Math.abs(nowSec - timestamp) > TIMESTAMP_TOLERANCE_SEC) {
    return res.status(400).send('Invalid or stale timestamp');
  }

  // Build the signature payload
  const fields = ['id', 'amount', 'currency', 'created_at_time', 'timestamp', 'cause', 'full_name', 'account_name', 'invoice_url'];
  const dataToSign = fields.map(f => String(payload[f] ?? '')).join('');

  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(Buffer.from(dataToSign, 'utf8'));
  const digest = hmac.digest('hex');

    const sigBuf = Buffer.from(String(signature), 'utf8');
  const digestBuf = Buffer.from(digest, 'utf8');
  if (sigBuf.length !== digestBuf.length) {
    return res.status(401).send('Invalid signature');
  }
  const valid = crypto.timingSafeEqual(digestBuf, sigBuf);
  if (!valid) return res.status(401).send('Invalid signature');


  res.status(200).send('OK');

  console.log('✅ Processed webhook:', payload);
});

// Start the server
app.listen(PORT, () => console.log(`Webhook server listening on port ${PORT}`));
