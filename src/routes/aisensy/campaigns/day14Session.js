import axios from "axios";

export const day14Session = async ({
    whatsappPhone,
    name,
    userId
}) => {

    console.log("recvied user data day 13 morning trigger: ", whatsappPhone, name, userId)
    try {

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "day14_live_qna",
            destination: whatsappPhone,
            userName: "Thrive Wellness",

            templateParams: [
                `${name} Ji 🙏`,
                "1 Day",
                "*Today*",
                "How To Continue Your Thrive Yoga Journey",
                "⏰ 11 AM & 7:00 PM (IST)",
                "✅ Answer your questions about the Thrive Yoga program",
                "✅ Explain membership plans",
                "✅ Help with any payment related queries",
                `https://thriveyoga.thrivewellness.in/join/m/${userId}`
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


export const day14SessionEvening = async ({
    whatsappPhone,
    name,
    userId
}) => {

    console.log("recvied user data day 14 evening trigger: ", whatsappPhone, name, userId)
    try {

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "day14_live_qna",
            destination: whatsappPhone,
            userName: "Thrive Wellness",

            templateParams: [
                `${name} Ji 🙏`,
                "1 Day",
                "*Today*",
                "How To Continue Your Thrive Yoga Journey",
                "⏰ 11 AM & 7:00 PM (IST)",
                "✅ Answer your questions about the Thrive Yoga program",
                "✅ Explain membership plans",
                "✅ Help with any payment related queries",
                `https://thriveyoga.thrivewellness.in/join/e/${userId}`
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



