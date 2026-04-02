
import axios from "axios";

export const sendThriveconsultaion3day = async ( id, whatsappPhone, name, dayNumber ) => {

    console.log("sendThriveconsultaion3day called with: user", { id, whatsappPhone, name });

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "3_day_left_rem_con",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [
                `${name} Ji 🌿`,
                "3 Day",
                "Free Thrive Yoga Program 🧘‍♂️",
                "From next Monday, our new Thrive Yoga batch begins. Before you decide the next step, we’d love to offer you a free 10-minute Consultation with our coach.",
                "https://www.thrivewellness.in/talk-to-expert?ref=3_day_left_rem_con_msg",
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



