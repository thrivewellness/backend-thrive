
import axios from "axios";

export const fiveMinSessionRemainder14Con = async ({ userId, whatsappPhone, name, dayNumber }) => {
      console.log("received user data : ", whatsappPhone, name, userId, dayNumber);
    const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "5_min_before_rem",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [
                `A Special on *How to Continue Your Journey After 14 Days*`,
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

export const fiveMinSessionRemainder14ConEve = async ({ userId, whatsappPhone, name, dayNumber }) => {
      console.log("received user data : ", whatsappPhone, name, userId, dayNumber);
    const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "5_min_before_rem",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [
                `A Special on *How to Continue Your Journey After 14 Days*`,
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

export const tommarowSessionRemainders14Con = async ({ userId, whatsappPhone, name, dayNumber }) => {
    console.log("received user data tomarow rem : ", whatsappPhone, name, userId, dayNumber);
    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "session_reminder_vid",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `*${name} Ji*`,
            `A Special on *How to Continue Your Journey After 14 Days*`,
            `*11 AM | 4 PM (IST)*`,
            `*40 Min*`,
            `• Learn to be consistent`,
            `• How Thrive Wellness Can improve Your quality of Life`,
            `• How Thrive Wellness Can help you reduce Medical expenses`
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/VIDEO/696b61f2951b730d7655fef4/4060320_14rem1.mp4",
            "filename": "14_rem_1.mp4"
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

export const liveNowRemainder14Com = async ({ userId, whatsappPhone, name, dayNumber }) => {
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