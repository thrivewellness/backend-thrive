import axios from "axios";

export async function sendTemplateMessage({ phone, templateName, name , date }) {
    console.log("Sending Gupshup template:", { phone, templateName, name, date });


  const body = new URLSearchParams({
    channel: "whatsapp",
    source: "919355221522",              // SAME as curl
    destination: phone,                  // e.g. 918050717704
    "src.name": process.env.GUPSHUP_APP_NAME, // e.g. thrivewellness    ",
    template: JSON.stringify({
      id: templateName,
      params: [
       name, date
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
