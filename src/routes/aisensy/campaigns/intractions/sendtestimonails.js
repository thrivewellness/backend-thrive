
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
            '💚 Meet our Thrive Hero, Shanto Venkatraman',
            `She Improved Her Strength & Sugar Levels at the Age of 80. 💪`,
            '✨How consistent strength training improved her strength and independence.',
            '✨How regular exercise helped support healthier sugar levels over time.🌿',
            "https://www.instagram.com/reels/DZfZO_iR7KJ/"
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
            '💚 Video for Today',
            `Tips To Prevent Knee Replacement by Orthopaedic Doctor`,
            '⚖️ How every extra kilogram puts 3 to 4 kg of pressure on knees.',
            '🚴 How movement feeds cartilage; complete rest causes more damage!',
            "https://www.youtube.com/watch?v=WS-SMCJ9N9w"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/7094137_preventknee.jpg",
            "filename": "preventknee.jpg"
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