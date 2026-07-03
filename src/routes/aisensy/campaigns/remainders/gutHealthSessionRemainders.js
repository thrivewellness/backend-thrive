
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

export const tommarowSessionRemaindersGutHealth = async ({ userId, whatsappPhone, name, dayNumber }) => {
    console.log("received user data tomarow rem : ", whatsappPhone, name, userId, dayNumber);
    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "session_reminder_vid",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `*${name} Ji*`,
            `A Special *Gut Health Session*`,
            `*11 AM | 4 PM (IST)*`,
            `*40 Min*`,
            `• What gut health really means`,
            `• Common gut issues like bloating, acidity, indigestion, and skin problems`,
            `• Lifestyle and nutrition solutions to improve gut health naturally`
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