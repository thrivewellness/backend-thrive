
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
            'Your thrive yoga starts in 4 days (10th aug 2026). Watch this informative video that helps you better understanding of healthy lifestyle',
            `Menopause me Weight Loss kaise kare? Best Exercises for Women 45+ 🔥`,
            '🚨 Why your body changes after menopause (and it’s not your fault).',
            '🏃 The right way to lose fat while protecting your strength.',
            "https://www.youtube.com/watch?v=ocIhXSoMTSU"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/8491188_menopauseweightloss.jpg",
            "filename": "menopause_weight_loss.jpg"
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



