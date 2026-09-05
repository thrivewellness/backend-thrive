
import axios from "axios";

export const sendThriveYogaPlans1day = async (id, whatsappPhone, name, dayNumber) => {

    console.log("sendThriveYogaPlans1day called with: user", { id, whatsappPhone, name });

    const phoneNumber = String(whatsappPhone ?? "").trim();
    const isIndianUser = phoneNumber.startsWith("91") && phoneNumber.length === 12;

    const planDetails = isIndianUser
        ? [
            "~₹ 16,500~",
            "*₹3,599 (78% off)*",
            "~₹ 4,500~",
            "*₹1,499 (67% off)*",
            "~₹ 999~",
            "*₹599 (40% off)*",
            `https://payment.thrivewellness.in/payment/yoga/basic?ref=1day_left_message&userid=${id}`,
        ]
        : [
            "~$450~",
            "*$99 (78% off)*",
            "~$118.18~",
            "*$39 (67% off)*",
            "~$20~",
            "*$10 (50% off)*",
            `https://payment.thrivewellness.in/payment/yoga/basic?cur=usd&ref=1day_left_message&userid=${id}`,
        ];

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "plans_rem_days_left",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `${name} Ji `,
            "1 Day",
            ...planDetails,
        ],

        source: "new-landing-page form",

        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/VIDEO/696b61f2951b730d7655fef4/7462956_1dayleft.mp4",
            "filename": "1-day_left.mp4"
        },

        buttons: [
            {
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [
                    {
                        type: "text",
                        text: `talk-to-expert?ref=1day_left_message`  // dynamic value (e.g., user ID, order ID, etc.)
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



