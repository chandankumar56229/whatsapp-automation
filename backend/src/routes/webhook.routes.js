const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

/**
 * Route: GET /webhook
 * Use: Used by Meta to verify ownership during initial Setup App Dashboard
 */
router.get('/', webhookController.verifyWebhook);

/**
 * Route: POST /webhook
 * Use: Endpoint where all incoming WhatsApp messages & read receipts are sent
 */
router.post('/', webhookController.receiveMessage);

module.exports = router;
