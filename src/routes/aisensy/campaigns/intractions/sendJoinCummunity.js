
import axios from "axios";

export const sendJoinCummunity = async ({ whatsappPhone, name, dayNumber }) => {

    console.log("sendJoinCummunity called with:", { whatsappPhone, name, dayNumber });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "join_cummunity_msg",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `${name} 👋`,
            `https://chat.whatsapp.com/KpSuwuiqzwzDEv8ZFmEn44`,
            "https://www.facebook.com/share/g/1D414kk5qj/?mibextid=wwXIfr",
        ],
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



