
import axios from "axios";

export const sendThriveYogaPlans1day = async (id, whatsappPhone, name, dayNumber) => {

    console.log("sendThriveYogaPlans1day called with: user", { id, whatsappPhone, name });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "1_2_rem_plan",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `${name} Ji 🌿`,
            "1 Day",
            "https://payment.thrivewellness.in/payment/yoga/advanced",
            "https://payment.thrivewellness.in/payment/yoga/basic"
        ],

        source: "new-landing-page form",
        media: {},
        buttons: [
            {
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [
                    {
                        type: "text",
                        text: `talk-to-expert?ref=trigger_plan_1day_left`  // dynamic value (e.g., user ID, order ID, etc.)
                    }
                ]
            }
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

    console.log("sendThriveYogaPlans1day response:", response.data);
    return response.data;

}



