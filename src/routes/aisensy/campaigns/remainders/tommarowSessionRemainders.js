
import axios from "axios";



export const tommarowDay1SessionRemainders = async ({ userId, whatsappPhone, name, dayNumber }) => {
    console.log("id: ",userId);
    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "day1_session_reminder_txt",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `*${name} Ji*`,
            `*Day 1 of Thrive Yoga*`,
            `*7 AM | 8 AM | 9 AM  & 5:30 | 6:30 | 7:30 PM (IST)*`,
            `*50 Min*`,
            `• Builds overall strength and stability`,
            `• Enhances full-body awareness`,
            `• Creates a strong foundation for safer, stronger movement`
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
    console.log(`Aisensy 5 min session remainder response for ${userId}:`, response.data);
    return response.data;
}

export const tommarowWelcomeSessionRemainder = async ({ userId, whatsappPhone, name, dayNumber }) => {
    console.log("received user data tomarow rem : ", whatsappPhone, name, userId, dayNumber);
    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "welcome_session_reminder_txt",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `*${name} Ji*`,
            `*Welcome Session*`,
            `19 July 2026`,
            `11 AM | 4 PM (IST)`,
            `40 Min`,
            `🧘 Understand the Thrive Yoga philosophy`,
            `🌿 Get familiar with the session structure and flow`,
            `❓ Clear all your doubts before starting`
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
    console.log(`Aisensy 5 min session remainder response for ${userId}:`, response.data);
    return response.data;
}
