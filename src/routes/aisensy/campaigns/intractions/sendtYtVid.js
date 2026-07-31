
import axios from "axios";

export const sendYtVid = async ({ whatsappPhone, name, dayNumber }) => {

    console.log("sendYtVid called with:", { whatsappPhone, name, dayNumber });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "send_vid_img",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `${name} 👋`,
            'Your thrive yoga starts in 2 days (03th aug 2026). Watch this informative video that helps you better understanding of healthy lifestyle',
            `You Can't Lose Belly Fat (The Real Reason) & How To Lose It`,
            '🚨 How high cortisol from stress signals your body to store belly fat.',
            '🏃 How combine strength training with cardio to engage core muscles',
            "https://www.youtube.com/watch?v=QXdvWhi1GE8"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/8346443_lossbelly.jpg",
            "filename": "loss_belly.jpg"
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



