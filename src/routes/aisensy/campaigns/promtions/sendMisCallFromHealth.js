
import axios from "axios";

export const sendMisCallFromHealth = async (id, whatsappPhone, name, dayNumber) => {

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "missedcall_from_health",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            "https://www.thrivewellness.in/talk-to-expert?ref=missedcall_from_health_mrk_message",
        ],

        source: "new-landing-page form",
         media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/43b4477c-a2ca-4865-87f1-02d8ce886061_misscallfromhealth.png",
            "filename": "misscallfrom_health.png"
        },
        buttons: [
        ],
        carouselCards: [],
        location: {},
        attributes: {},

        paramsFallbackValue: {
            FirstName: "user"
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



