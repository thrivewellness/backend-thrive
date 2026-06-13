
import axios from "axios";

export const send15MinDrill = async ({ whatsappPhone, name, dayNumber }) => {

    console.log("send15MinDrill called with:", { whatsappPhone, name, dayNumber });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "send_dril_before_start",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `${name} 👋`,
            `Your 14 Days Free Thrive Yoga Journey`,
            "Monday (15th June 2026)",
            "You can start practising this 15 Min Thrive Yoga Session from today itself",
            "https://youtu.be/KpbIfcaKdX4"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/9950149_15mindrill.jpg",
            "filename": "15mindrill.jpg"
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



