import axios from "axios";

export const sendAiSensyYogaSignup = async ({
  whatsappPhone,
  name,
  startDate,
  refId,
  userId,
}) => {
  try {
    const payload = {
      apiKey: process.env.AISENSY_API_KEY,
      campaignName: "first_meassage",
      destination: whatsappPhone,
      userName: name,
      source: "yoga_signup",

      templateParams: [
        String(name),
        String(startDate),
      ],

      media: {
        url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/5058507_110.jpg",
        filename: "1(10).jpg",
      },

      tags: [String(startDate), "free_yoga", "yoga_signup"],

      attributes: {
        name: String(name),
        startDate: String(startDate),
        refId: refId ? String(refId) : "",
        userId: userId ? String(userId) : "",
      },
    };

    const response = await axios.post(
      "https://backend.aisensy.com/campaign/t1/api/v2",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error) {
    console.error(
      "AiSensy Campaign Error:",
      error?.response?.data || error.message
    );
  }
};
