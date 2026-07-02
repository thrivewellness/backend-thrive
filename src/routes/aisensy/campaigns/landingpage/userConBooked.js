
import axios from "axios";

export const userConBooked = async ({ whatsappPhone, name }) => {

    console.log("userConBooked called with:", { whatsappPhone, name });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "consultatation_msg",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `*${name} 👋*`,
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/8193683_consultaionposter.jpg",
            "filename": "consultaion_poster.jpg"
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



