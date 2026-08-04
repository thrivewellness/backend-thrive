
import axios from "axios";

export const sendInstTestimonails = async ({ whatsappPhone, name, dayNumber }) => {

    console.log("sendInstTestimonails called with:", { whatsappPhone, name, dayNumber });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "send_vid_img",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `${name} 👋`,
            '💚 Meet our Thrive Hero, Kanta Rathi',
            `She Reversed Years of Knee Pain and Finally Got Her Thyroid Under Control 💪`,
            '✨How she Lost 11 kgs without giving up her daily routine or extreme dieting.',
            "✨How she Regained the strength to climb stairs and able to move freely🌿",
            "https://www.instagram.com/reels/DZFiNlYhfFE/"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/9520352_kanthitestimonail.jpg",
            "filename": "kanthi_testimonail.jpg"
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


    console.log(`Aisensy sendInstTestimonails response for ${whatsappPhone}:`, response.data);  
    return response.data;
}

export const sendInstTestimonailsnew = async ({ whatsappPhone, name, dayNumber }) => {

    console.log("sendInstTestimonails called with:", { whatsappPhone, name, dayNumber });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "send_vid_img",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `${name} 👋`,
            '💚 Video for Today ',
            `Scientific Ways To Lower Cholesterol Naturally `,
            '🥑How cholesterol balance relies on your liver and habits, not oil!',
            '🥣How soluble fiber in oats traps excess cholesterol to flush it out.',
            "https://www.youtube.com/watch?v=dwbshV_rJYA"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/2744013_cholesterol%20vid.jpg",
            "filename": "cholesterol _vid.jpg"
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


    console.log(`Aisensy sendInstTestimonails response for ${whatsappPhone}:`, response.data);  
    return response.data;
}