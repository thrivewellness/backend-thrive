
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
            `She Lost 9+ Kgs at the age of 60 & revered her Pre diabetes. Here's is her son about this experience!`,
            "https://www.instagram.com/reel/DYzfhkABIqx/?igsh=dWZ1eWZ2bWg3MW9p"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/1200085_testimonial1.jpeg",
            "filename": "testimonial_1.jpeg"
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



