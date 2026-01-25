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
            campaignName: "day_01_rem",
            destination: whatsappPhone,
            userName: "Thrive Wellness",

            templateParams: [
                "Day 1",
                "Strength, Stability & Body Awareness",
                "Builds overall strength and stability",
                "Enhances full-body awareness",
                "Creates a strong foundation for safer, stronger movement"
            ],

            source: "new-landing-page form",

            media: {
                url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/4415314_day1.jpg.jpeg",
                filename: "day1.jpg.jpeg",
            },
            buttons: [
                {
                    "type": "button",
                    "sub_type": "URL",
                    "index": 0,
                    "parameters": [
                        {
                            "type": "text",
                            "text": `/${String(userId)}`
                        }
                    ]
                }

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
