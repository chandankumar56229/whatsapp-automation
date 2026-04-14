const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Send Manual Message via Meta API (WhatsApp)
 * Extracted from Dashbord's human agent
 */
exports.sendManualMessage = async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ error: "Missing 'to' or 'message' in request body." });
    }

    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { preview_url: false, body: message }
    };

    const headers = {
      "Authorization": `Bearer ${process.env.META_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    };

    const response = await axios.post(url, data, { headers });
    console.log(`✅ Message successfully sent out to +${to}`);
    
    return res.status(200).json({ success: true, messageId: response.data.messages[0].id });
  } catch (error) {
    console.error('❌ Error sending manual message to customer:', error?.response?.data || error.message);
    return res.status(500).json({ error: "Failed to send message via Meta API" });
  }
};
