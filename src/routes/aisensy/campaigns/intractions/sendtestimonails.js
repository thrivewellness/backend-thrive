
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
            '💚 Meet our Thrive Hero, Shatha Venkatraman',
            `She Improved Her Strength & Sugar Levels at the Age of 80 💪`,
            '✨How she improved her strength, and has seen positive changes in her sugar levels.',
            '✨How she able to confidently lifts 2.5-3 kg in each hand',
            "https://www.instagram.com/reel/DZfZO_iR7KJ/"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/9399044_testimonials.png",
            "filename": "testimonials.png"
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
            '💚 Video For Video',
            `4 Exercises for Severe Knee Pain.`,
            '✨Know the reason of your knee pain.',
            '✨Exercises to reduce knee pain.',
            "https://www.instagram.com/reel/DR99Bi3Etil/"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/1847650_Image423.jpg",
            "filename": "Image-423.jpg"
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