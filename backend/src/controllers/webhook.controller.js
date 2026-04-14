/**
 * WEBOOK CONTROLLER (Meta API Callback Handling)
 * Security: Validates the VERIFY_TOKEN to ensure requests come only from Meta.
 */
const dotenv = require('dotenv');
dotenv.config();

// GET Request: Used by Meta to verify the Webhook connection initially
exports.verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      console.log('✅ WEBHOOK VERIFIED BY META');
      return res.status(200).send(challenge);
    } else {
      console.error('❌ WEBHOOK VERIFICATION FAILED: Token Mismatch');
      return res.sendStatus(403);
    }
  }
  return res.sendStatus(400);
};

// POST Request: Receives new messages from customers
exports.receiveMessage = (req, res) => {
  try {
    const body = req.body;

    // Check if it's a WhatsApp API Event
    if (body.object === 'whatsapp_business_account') {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const messageObj = body.entry[0].changes[0].value.messages[0];
        let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = messageObj.from; // sender number
        
        let msg_body = "";
        
        // BUG FIX: Safety Check for Non-Text Messages (Images, Audio, Buttons)
        if (messageObj.type === 'text') {
          msg_body = messageObj.text.body;
        } else if (messageObj.type === 'interactive') {
          // If customer taps a button like "Not Interested" or "Yes"
          msg_body = messageObj.interactive.button_reply?.title || messageObj.interactive.list_reply?.title;
        } else {
          // If user sends media, sticker, etc.
          msg_body = `📍 [Customer sent a ${messageObj.type} file]`;
        }

        console.log(`📩 New Message from ${from}: ${msg_body}`);

        // TODO: Pass this to State Machine Logic & emit via Socket.io to React Dashboard
        const io = req.app.get('socketio');
        io.emit('new_message', { from, msg_body, timestamp: new Date() });
      }
      
      // Meta requires a 200 OK fast response to acknowledge receipt
      res.sendStatus(200);
    } else {
      // Not a WhatsApp event
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('❌ CRITICAL ERROR in Webhook Controller:', error);
    res.sendStatus(500); // 500 error saves our server from completely crashing
  }
};
