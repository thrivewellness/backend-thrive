import axios from "axios";

export const sendWelcomeSessionMorningMessage = async ({
    whatsappPhone,
    name,
    userId
}) => {

    console.log("recvied data : ", whatsappPhone, name, userId)
    try {
        const url = `https://thriveyoga.thrivewellness.in/join/${userId}`

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "mor_wel_s",
            destination: whatsappPhone, 
            userName: "Thrive Wellness",

            templateParams: [
                String(name),
                "11:00 - 11:40 AM (IST)",
                "6:00 - 6:40 PM (IST)",
            ],

            source: "new-landing-page form",

            media: {},
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

        return response.data;
    } catch (error) {
        console.error(
            "AiSensy Welcome Morning Error:",
            error?.response?.data || error.message
        );
        throw error;
    }
};
