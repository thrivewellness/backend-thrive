import axios from "axios";

const AISENSY_URL = "https://backend.aisensy.com/campaign/t1/api/v2";

export const absentFunctionPaid = async (userId, whatsappPhone, name) => {
  const payload = {
    apiKey: process.env.AISENSY_API_KEY,
    campaignName: "absent_free_yoga",
    destination: whatsappPhone,
    userName: "Thrive Integrated Lifestyle Private Limited",
    templateParams: [`*${name || "user"} Ji* \uD83D\uDC4B`],
    source: "new-landing-page form",
    media: {},
    buttons: [],
    carouselCards: [],
    location: {},
    attributes: {},
    paramsFallbackValue: {
      FirstName: "user",
    },
  };

  try {
    const response = await axios.post(AISENSY_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (err) {
    console.error("AiSensy paid absent campaign failed:", {
      userId,
      status: err.response?.status,
      response: err.response?.data,
    });
    throw err;
  }
};
