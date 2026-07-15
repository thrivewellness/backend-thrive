
import axios from "axios";

export const sendtYtVidManual = async ({ whatsappPhone, name, dayNumber }) => {

    console.log("sendtYtVidManual called with:", { whatsappPhone, name, dayNumber });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "send_info_vid_img",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `${name} 👋`,
            `Fix Your Thyroid Naturally 🔥`,
            '✨Why thyroid slows metabolism & causes weight gain.',
            '✨Lifestyle habits to support thyroid health.',
            "https://youtu.be/CFAPvOdaUqw"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/630005_4.jpg.jpeg",
            "filename": "4.jpg.jpeg"
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

    console.log(`Aisensy sendtYtVidManual response for ${whatsappPhone}:`, response.data);

    return response.data;
}



