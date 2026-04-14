const axios = require('axios');

// Yeh wahi exact JSON structure hai jo Meta (WhatsApp) hamare server ko bhejta hai
const fakeCustomerMessage = {
  object: "whatsapp_business_account",
  entry: [{
    changes: [{
      value: {
        metadata: { phone_number_id: "1234567890" },
        messages: [{
          from: "919876543210", // Customer ka dummy number
          type: "text",
          text: { body: "Hi, mujhe properties dekhni hain!" } // Dummy message
        }]
      }
    }]
  }]
};

console.log("🚀 Sending fake WhatsApp message to local backend...");

// Apne local Node.js server par POST request bhej rahe hain
axios.post('http://localhost:8000/webhook', fakeCustomerMessage)
  .then(response => {
    console.log("✅ Success! Webhook ne message receive kar liya.");
    console.log("👉 Ab apna React Dashboard check karo, wahan ye message zaroor aaya hoga!");
  })
  .catch(error => {
    console.error("❌ Error:", error.message);
    console.log("⚠️ Dhyan rahe: Isko chalane se pehle aapka Node.js server (npm run dev) chalu hona chahiye!");
  });
