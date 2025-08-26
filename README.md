# yaya-webhook
Webhook verification solution for Yaya Wallet

This solution demonstrates how to securely implement and test a webhook endpoint sent by Yaya Wallet to a client that verifies incoming requests.
To ensure that it is only trusted senders that can send valid requests to the webhook, every incoming request includes a signature header and the server must verify the signature before accepting the request.

Assumptions:
Requests include a signature in the header generated using the secret

Files:
In the webhook.js file, a simple Express server with one /webhook endpoint parses incoming JSON. reads the signature header, recomputes the signature using the shared secret, then accepts or rejects the request.
The send_test.js file is for the purpose of simulating sending a request to the webhook

How to test:
Clone the repo
Install dependencies:
npm install express
Start the webhook server:
node webhook.js
Run the test sender (by first setting the secret to the one same as in the webhook file)
$env:YAYA_WEBHOOK_SECRET="bezawits_secret"
node send_test.js

Expected output:
Response status: 200 OK
Response body: OK
