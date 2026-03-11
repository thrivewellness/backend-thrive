
import axios from "axios";

export const sendThriveYogaPlansMessage = async (userId, whatsappPhone, name, dayNumber) => {

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "plans_rem",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [
                `${name} Ji `,
                "Your 14-Day Free Thrive Yoga sessions have now ended. But this is just the beginning of your wellness journey! ",
                "✨Thrive Yoga – Basic",
                "Only ₹300/month (billed annually)",
                "Link – https://payment.thrivewellness.in/payment/yoga/basic",
                "✨Thrive Yoga – Advanced",
                "Only ₹999/month (billed annually)",
                "Link – https://payment.thrivewellness.in/payment/yoga/advanced",
            ],

            source: "new-landing-page form",
            media: {},
            buttons: [],
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



