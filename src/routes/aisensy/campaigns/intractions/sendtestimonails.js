
import axios from "axios";

export const sendInstTestimonails = async ({ whatsappPhone, name, dayNumber }) => {

    console.log("sendInstTestimonails called with:", { whatsappPhone, name, dayNumber });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "send_inst_story",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `${name} 👋`,
            `How Archana Lost 14 Kgs At the age of 48.`,
            "https://www.instagram.com/reel/DT8B45bkfRa/?igsh=MWV5bzEybHBnODZkMA=="
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



