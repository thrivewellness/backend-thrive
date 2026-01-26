import axios from "axios";

export const sendWelcomeSessionMorningMessage = async ({
    whatsappPhone,
    name,
    userId
}) => {

    console.log("recvied user data : ", whatsappPhone, name, userId)
    try {
        const url = `https://thriveyoga.thrivewellness.in/join/${userId}`

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "morning_message",
            destination: whatsappPhone,
            userName: "Thrive Wellness",

            templateParams: [
                name,
                "Posture Reset & Joint Alignment"
            ],

            source: "new-landing-page form",

            media: {
            },
            buttons: [
        

            ],
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
