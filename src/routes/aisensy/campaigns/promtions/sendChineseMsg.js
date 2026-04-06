
import axios from "axios";

export const sendChineseMsg = async ( id, whatsappPhone, name, dayNumber ) => {

    console.log("sendChineseMsg called with: user", { id, whatsappPhone, name });

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "mar_chinese",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [],

            source: "new-landing-page form",
            media: {},
            buttons: [],
            carouselCards: [],
            location: {},
            attributes: {},

            paramsFallbackValue: {
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



