
import axios from "axios";

export const coachLeadRemainder = async ({
    id,
    whatsappPhone,
    name,
    phnumber,
    duration,
    created_at,
    goal,
    symptoms,
    readiness,
    service,
    ref,
}) => {

    console.log("coachLeadRemainder called with: user", { id, whatsappPhone, name });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "caoch_lead_noti",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            name,
            phnumber,
            duration,
            created_at,
            goal,
            symptoms,
            duration,
            readiness,
            service,
            ref,
            `https://admin.thrivewellness.in/leads/update?id=${id}`,
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



