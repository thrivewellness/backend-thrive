import axios from "axios";

const BASE_URL = "https://api.gupshup.io/wa/api/v1";

/**
 * Send template message
 */
export async function sendTemplateMessage({ phone, templateId, params = [] }) {
  const body = new URLSearchParams({
    channel: "whatsapp",
    source: "919355221522",
    destination: phone,
    "src.name": process.env.GUPSHUP_APP_NAME,
    template: JSON.stringify({
      id: templateId,
      params
    })
  });

  const result = await axios.post(`${BASE_URL}/template/msg`, body.toString(), {
    headers: {
      apikey: process.env.GUPSHUP_API_KEY,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  console.log("Template message sent:", result.data);
}

/**
 * Send image message
 */
export async function sendImageMessage({ phone, imageUrl, caption }) {

  console.log("Sending image message:", { phone, imageUrl });

  const body = new URLSearchParams({
    channel: "whatsapp",
    source: "919355221522",
    destination: phone,
    "src.name": process.env.GUPSHUP_APP_NAME,
    message: JSON.stringify({
      type: "image",
      image: {
        link: imageUrl,
        caption // keep SHORT
      }
    })
  });

  const result = await axios.post(
    `${BASE_URL}/msg`,
    body.toString(),
    {
      headers: {
        apikey: process.env.GUPSHUP_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  console.log("Image message sent:", result.data);
}

/**
 * Send text message
 */
export async function sendTextMessage({ phone, text }) {
  const body = new URLSearchParams({
    channel: "whatsapp",
    source: "919355221522",
    destination: phone,
    "src.name": process.env.GUPSHUP_APP_NAME,
    message: JSON.stringify({
      type: "text",
      text
    })
  });

  await axios.post(`${BASE_URL}/msg`, body.toString(), {
    headers: {
      apikey: process.env.GUPSHUP_API_KEY
    }
  });
}
