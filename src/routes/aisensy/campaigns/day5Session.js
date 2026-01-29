import axios from "axios";

export const day5Session = async ({
    whatsappPhone,
    name,
    userId
}) => {

    console.log("recvied user data day 5 trigger : ", whatsappPhone, name, userId)
    try {

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "good_morning",
            destination: whatsappPhone,
            userName: "Thrive Wellness",

            templateParams: [
                `${name} Ji ☀️`,
                "🎯 Focus",
                "*Muscle Activation Without Weights*"
            ],

            source: "new-landing-page form",

            media: {},
            buttons: [],
            carouselCards: [],
            location: {},
            attributes: {},
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
        console.log(`Aisensy response for ${userId}:`, response.data)
        return response.data;
    } catch (error) {
        console.error(
            "AiSensy Welcome Morning Error:",
            error?.response?.data || error.message
        );
        throw error;
    }
};



export const day5SessionEvening = async ({
    whatsappPhone,
    name,
    userId
}) => {

    console.log("recvied user data : ", whatsappPhone, name, userId)
    try {

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "evening_session_message",
            destination: whatsappPhone,
            userName: "Thrive Wellness",

            templateParams: [
                `${name}`,
                "Morning",
                "5:30 PM | 6:30 PM | 7:30 PM (IST)"
            ],

            source: "new-landing-page form",

            media: {
                url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/8832571_day5.jpeg",
                filename: "day5.jpeg",
            },
            buttons: [],
            carouselCards: [],
            location: {},
            attributes: {},
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
        console.log(`Aisensy response for ${userId}:`, response.data)
        return response.data;
    } catch (error) {
        console.error(
            "AiSensy Welcome Morning Error:",
            error?.response?.data || error.message
        );
        throw error;
    }
};
