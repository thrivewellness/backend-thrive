
import axios from "axios";

export const sendYtVid = async ({ whatsappPhone, name, dayNumber }) => {

    console.log("sendYtVid called with:", { whatsappPhone, name, dayNumber });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "send_info_vid_img",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `*${name} 👋*`,
            `🌿*14 KG Weight Loss Transformation + Diet & Workout Secrets*`,
            `✨ Insights of an weight loss journey`,
            `✨ Secrets that helped in losing 14 KG in 3 months`,
            "https://youtu.be/XX6Cc4vHPZQ"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/6168911_7.jpg.jpeg",
            "filename": "7.jpg.jpeg"
        },
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



