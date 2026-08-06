
import axios from "axios";

export const sendYtVid = async ({ whatsappPhone, name, dayNumber, todayDate }) => {

    console.log("sendYtVid called with:", { whatsappPhone, name, dayNumber, todayDate });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "send_vid_img",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `${name} 👋`,
            'Your thrive yoga starts in 3 days (10th aug 2026). Watch this informative video that helps you better understanding of healthy lifestyle',
            `Always Tired? It's Not Age or Stress- It Could Be B12 Deficiency 🔥`,
            "😴 Tired all day? It's likely B12 deficiency, not stress.",
            "⚡ B12 protects your nerves and boosts daily energy.",
            "https://www.youtube.com/watch?v=e34qmbIf7cU"
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/4392583_b12video.jpg",
            "filename": "b12video.jpg"
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



