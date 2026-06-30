
import axios from "axios";

export const sendPlansOfferMsg = async (id, whatsappPhone, name, dayNumber) => {

    console.log("sendPlansOfferMsg called with: user", { id, whatsappPhone, name });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "plans_offer_msg",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `${name} Ji 🙏`,
            "https://payment.thrivewellness.in/payment/yoga/basic",
        ],

        source: "new-landing-page form",
         media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/5775572_plansoffermsg.jpg",
            "filename": "plans_offer_msg.jpg"
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

    console.log("sendThriveYogaPlans1day response:", response.data);
    return response.data;

}



