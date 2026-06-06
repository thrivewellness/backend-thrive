
import axios from "axios";

export const fiveMinSessionRemainderMetabolHealth = async ({ userId, whatsappPhone, name, dayNumber }) => {
      console.log("received user data : ", whatsappPhone, name, userId, dayNumber);
    const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "5_min_before_rem",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [
                `*Metabolic Health Session*`,
                `https://thriveyoga.thrivewellness.in/join/m/${userId}`,
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

export const fiveMinSessionRemainderMetabolHealthEvening = async ({ userId, whatsappPhone, name, dayNumber }) => {
      console.log("received user data : ", whatsappPhone, name, userId, dayNumber);
    const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "5_min_before_rem",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [
                `*Metabolic Health Session*`,
                `https://thriveyoga.thrivewellness.in/join/e/${userId}`,
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

export const tommarowSessionRemaindersMetabolHealth = async ({ userId, whatsappPhone, name, dayNumber }) => {
    console.log("received user data tomarow rem : ", whatsappPhone, name, userId, dayNumber);
    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "session_reminder_vid",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `*${name} Ji*`,
            `A Special *Metabolic Health Session*`,
            `*11 AM | 6 PM (IST)*`,
            `*40 Min*`,
            `• What Metabolic health really means`,
            `• Common metаbolic issues like weight gain, diabetes, fatigue, and hormonal imbalances`,
            `• Lifestyle and nutrition solutions to improve metabolic health naturally`
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/VIDEO/696b61f2951b730d7655fef4/9945042_guthaelthreminder.mp4",
            "filename": "gut_haelth_reminder.mp4"
        },
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

export const liveNowRemainderMetabolHealth = async ({ userId, whatsappPhone, name, dayNumber }) => {
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