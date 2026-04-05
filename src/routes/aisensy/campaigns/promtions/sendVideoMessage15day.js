
import axios from "axios";

export const sendVideoMessage15day = async (userId, whatsappPhone, name, dayNumber) => {

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "day_14_completed",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [
                `${name} Ji`,
            ],

            source: "new-landing-page form",
            media: {
                "url": "https://d3jt6ku4g6z5l8.cloudfront.net/VIDEO/696b61f2951b730d7655fef4/5372169_Sequence%20028%203.mp4",
                "filename": "Sequence 02_8 (3).mp4"
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

        return response.data;
}



