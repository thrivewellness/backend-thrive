import axios from "axios";

const BASE_URL = "https://api.gupshup.io/wa/api/v1";

export async function sendWelcomeTemplate({
  phone,
  name,
  startDate
}) {
  console.log("Sending Gupshup template:", { phone, name, startDate });

  const body = new URLSearchParams({
    channel: "whatsapp",
    source: "919355221522",              // SAME as curl
    destination: phone,                  // e.g. 918050717704
    "src.name": "thrivewellness",
    template: JSON.stringify({
      id: "814a2bce-a560-4d84-a3ac-dbcb9b28920a",
      params: [
        name, startDate 
      ]
    }),
    message: JSON.stringify({
      type: "image",
      image: {
        link: "https://fss.gupshup.io/0/public/0/0/gupshup/919355221522/d3c6c611-b822-41ea-86e6-fad4824d54eb/1767892465557_1%2810%29.jpg"
      }
    })
  });

  await axios.post(
    "https://api.gupshup.io/wa/api/v1/template/msg",
    body.toString(),
    {
      headers: {
        apikey: process.env.GUPSHUP_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache"
      }
    }
  );
}


export async function sendStep2Message({
  phone,
  templateId,
  startDate,
  ImgaeUrl
}) {
  console.log("Sending Gupshup template:", { phone,templateId, startDate, ImgaeUrl  });

  const body = new URLSearchParams({
    channel: "whatsapp",
    source: "919355221522",              // SAME as curl
    destination: phone,                  // e.g. 918050717704
    "src.name": process.env.GUPSHUP_APP_NAME,
    template: JSON.stringify({
      id: templateId,
      params: [startDate]
      
    }),
    message: JSON.stringify({
      type: "image",
      image: {
        link: ImgaeUrl
      }
    })
  });

  await axios.post(
    "https://api.gupshup.io/wa/api/v1/template/msg",
    body.toString(),
    {
      headers: {
        apikey: process.env.GUPSHUP_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache"
      }
    }
  );
}

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



export async function sendTemplateMessageWithImage({ phone, templateId, params = [], ImageUrl  }) {


  console.log("Sending Gupshup template with image:", { phone, templateId, params, ImageUrl });
  const body = new URLSearchParams({
    channel: "whatsapp",
    source: "919355221522",
    destination: phone,
    "src.name": process.env.GUPSHUP_APP_NAME,
    template: JSON.stringify({
      id: templateId,
      params
    }),
    message: JSON.stringify({
      type: "image",
      image: {
        link: ImageUrl
      }
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
