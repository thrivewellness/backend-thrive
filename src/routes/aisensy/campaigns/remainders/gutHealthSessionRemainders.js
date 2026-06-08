
import axios from "axios";

export const fiveMinSessionRemainderGutHealth = async ({ userId, whatsappPhone, name, dayNumber }) => {
      console.log("received user data : ", whatsappPhone, name, userId, dayNumber);
    const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "5_min_before_rem",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [
                `*Gut Health Session*`,
                `https://thriveyoga.thrivewellness.in/join/sp/m/${userId}`,
            ],
            source: "new-landing-page form",
            media: {},
            buttons: [],
            carouselCards: [],
            location: {},
            attributes: {},
            paramsFallbackValue: {
                FirstName: "user"
            }
        };

        const response = await axios.post(
            "https://backend.aisensy.com/campaign/t1/api/v2",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(`Aisensy 5 min session remainder response for ${userId}:`, response.data);
        return response.data;
}



export const liveNowRemainderGutHealth = async ({ userId, whatsappPhone, name, dayNumber }) => {
        console.log("received user data for live now rem : ", whatsappPhone, name, userId, dayNumber);  
    const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "trigger_on_live",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [`*Live Now 🔴*`],
            source: "new-landing-page form",
            media: {},
            buttons: [],
            carouselCards: [],
            location: {},
            attributes: {},
            paramsFallbackValue: {
                FirstName: "user"
            }
        };

        const response = await axios.post(
            "https://backend.aisensy.com/campaign/t1/api/v2",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(`Aisensy live now remainder response for ${userId}:`, response);
        return response.data;
}

export const fiveMinSessionRemainderGutHealthEvening = async ({ userId, whatsappPhone, name, dayNumber }) => {
      console.log("received user data : ", whatsappPhone, name, userId, dayNumber);
    const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "5_min_before_rem",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [
                `*Gut Health Session*`,
                `https://thriveyoga.thrivewellness.in/join/sp/e/${userId}`,
            ],
            source: "new-landing-page form",
            media: {},
            buttons: [],
            carouselCards: [],
            location: {},
            attributes: {},
            paramsFallbackValue: {
                FirstName: "user"
            }
        };

        const response = await axios.post(
            "https://backend.aisensy.com/campaign/t1/api/v2",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(`Aisensy 5 min session remainder response for ${userId}:`, response.data);
        return response.data;
}