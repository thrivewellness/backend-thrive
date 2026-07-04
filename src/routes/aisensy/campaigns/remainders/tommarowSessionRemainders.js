
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
            `*Day 1 of thrive yoga*`,
            `*7 AM | 5:30 PM (IST)*`,
            `*50 Min*`,
            `• Builds overall strength and stability`,
            `• Enhances full-body awareness`,
            `• Creates a strong foundation for safer, stronger movement`
        ],
        
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/VIDEO/696b61f2951b730d7655fef4/9945042_guthaelthreminder.mp4",
            "filename": "gut_haelth_reminder.mp4"
        },
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
            `28 June 2026`,
            `11 AM | 6 PM (IST)`,
            `40 Min`,
            `🧘 Understand the Thrive Yoga philosophy`,
            `🌿 Get familiar with the session structure and flow`,
            `❓ Clear all your doubts before starting`
        ],
        source: "new-landing-page form",
        media: {
            "url": "https://d3jt6ku4g6z5l8.cloudfront.net/VIDEO/696b61f2951b730d7655fef4/9945042_guthaelthreminder.mp4",
            "filename": "gut_haelth_reminder.mp4"
        },
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
