import axios from "axios";

export const day7Session = async ({
    whatsappPhone,
    name,
    userId
}) => {

    console.log("recvied user data day 7 morning trigger : ", whatsappPhone, name, userId)
    console.log(" metbalic health trigger : ")
    try {

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "gut_health_session",
            destination: whatsappPhone,
            userName: "Thrive Wellness",
            templateParams: [
                `${name}`,
                "Science of Metabolic Health",
                "Today",
                "11:00 AM | 6 PM",
                `https://thriveyoga.thrivewellness.in/join/sp/${userId}`
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


export const day7SessionEvening = async ({
    whatsappPhone,
    name,
    userId
}) => {

    console.log("recvied user data day 7 evening trigger : ", whatsappPhone, name, userId)
    console.log(" metbalic health trigger : ")
    try {
        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "gut_health_session",
            destination: whatsappPhone,
            userName: "Thrive Wellness",
            templateParams: [
                `${name}`,
                "Science of Metabolic Health",
                "Today",
                "11:00 AM | 6 PM",
                `https://thriveyoga.thrivewellness.in/join/sp/${userId}`
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

