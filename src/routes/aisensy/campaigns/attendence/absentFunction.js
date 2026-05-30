import axios from "axios";

export const absentFunction = async (userId, whatsappPhone, name, dayNumber, isConsecutive3DaysAbsent = false) => {
  const payload = {
    apiKey: process.env.AISENSY_API_KEY,
    campaignName: isConsecutive3DaysAbsent ? "absent_free_yoga_3day" : "absent_free_yoga",
    destination: whatsappPhone,
    userName: "Thrive Integrated Lifestyle Private Limited",
    templateParams: [`${name || "user"} Ji`, `Day ${dayNumber}`],
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

  const response = await axios.post("https://backend.aisensy.com/campaign/t1/api/v2", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
