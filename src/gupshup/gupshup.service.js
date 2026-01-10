import axios from "axios";

export async function sendTemplateMessage({ phone, templateName, params }) {
  const payload = {
    type: "template",
    template: {
      name: templateName,
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: params.map((text) => ({
            type: "text",
            text
          }))
        }
      ]
    }
  };

  const response = await axios.post(
    "https://api.gupshup.io/sm/api/v1/msg",
    new URLSearchParams({
      channel: "whatsapp",
      source: process.env.GUPSHUP_APP_NAME,
      destination: phone,
      message: JSON.stringify(payload)
    }),
    {
      headers: {
        apikey: process.env.GUPSHUP_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  return response.data;
}
