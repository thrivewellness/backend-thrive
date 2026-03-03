import axios from "axios";


export const presentFunction = async (userId, whatsappPhone, name, dayNumber) => {

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "present_free_yoga",
            destination: whatsappPhone,
            userName: "Thrive Wellness",

            templateParams: [
                `${name}`,
                `${dayNumber} completed strong 💪`,
                "Present ✔️",
                "✅✅✅⬜⬜⬜",
                "💪 Progress is built quietly, one day at a time."
            ],

            source: "new-landing-page form",

            media: {},
            buttons: [],
            carouselCards: [],
            location: {},
            attributes: {},
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