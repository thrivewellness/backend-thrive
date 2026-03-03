
import axios from "axios";

export const absentFunction = async (userId, whatsappPhone, name, dayNumber) => {

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "absent_free_yoga",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [
                `${name}`,
            ],

            source: "new-landing-page form",
            media: {
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



