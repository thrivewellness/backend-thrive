import axios from "axios";

export async function sendYogaSignupWhatsApp({
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