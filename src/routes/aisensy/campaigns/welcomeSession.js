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
            campaignName: "send_eving_wel_remiander",
            destination: whatsappPhone, 
            userName: "Thrive Wellness",

            templateParams: [
                String(name),
                "11 AM",
                "6:00 - 6:40 PM (IST)",
            ],

            source: "new-landing-page form",

            media: {
                url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/8754792_Welcome%20session.jpg.jpeg",
        filename: "Welcome session.jpg.jpeg",
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
        console.log(`Aisensy response for ${userId}:`,response.data)
        return response.data;
    } catch (error) {
        console.error(
            "AiSensy Welcome Morning Error:",
            error?.response?.data || error.message
        );
        throw error;
    }
};
