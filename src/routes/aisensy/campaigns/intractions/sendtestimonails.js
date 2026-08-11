
import axios from "axios";

export const sendInstTestimonails = async ({ whatsappPhone, name, dayNumber }) => {

  
    {/*
        const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "send_vid_img",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",
        
        templateParams: [
            `${name} 👋`,
            '💚 Meet our Thrive Hero, Silky Chauhan',
            `*She Lost 10 Kgs at Age 45 + Reduced Inflammation & Body Pain.*💪`,
            '✨How she reduced weight, inflammation, and daily body pain.',
            '✨How small changes that created a big transformation in her health.🌿',
            "https://www.instagram.com/reels/DU0f2iekaGM/"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/6788923_testimoals2.jpeg",
            "filename": "testimoals_2.jpeg"
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
*/}

    return response.data;
}

export const sendInstTestimonailsnew = async ({ whatsappPhone, name, dayNumber }) => {

   {/* 
    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "send_vid_img",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

         templateParams: [
            `${name} 👋`,
            '💚 Meet our Thrive Hero, Archana Bhimasen',
            `She Lost 14 Kgs at Age 48 💪`,
            '✨How she transformed her body after 40 with simple lifestyle changes.',
            '✨The habits that helped her reduce weight and inflammation naturally.',
            "https://www.youtube.com/watch?v=XX6Cc4vHPZQ"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/9076501_archanaytvid.jpg",
            "filename": "archanaytvid.jpg"
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
*/}
    return response.data;
}