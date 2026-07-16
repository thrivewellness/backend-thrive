
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
            'Your thrive yoga starts from upcoming monday. Watch this informative video that helps you better understanding of healthy lifestyle',
            `Weight Loss Transformation + Diet & Workout Secrets`,
            '✨Habits behind a successful transformation.',
            '✨How nutrition + exercise create lasting fat loss.',
            "https://youtu.be/XX6Cc4vHPZQ"
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

    return response.data;
}



