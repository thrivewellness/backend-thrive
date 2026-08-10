
import axios from "axios";

const formatReadableDate = (dateString) => {
    if (!dateString) return "Tomorrow";

    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
    }).format(date);
};

const subtractDays = (dateString, days) => {
    if (!dateString) return null;

    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() - days);

    return date.toISOString().slice(0, 10);
};


export const tommarowDay1SessionRemainders = async ({ userId, whatsappPhone, name, dayNumber, session_startdate }) => {

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
    
    return response.data;
}

export const tommarowWelcomeSessionRemainder = async ({ userId, whatsappPhone, name, dayNumber, session_startdate }) => {
 
    const welcomeSessionDate = formatReadableDate(subtractDays(session_startdate, 1));
   
    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "welcome_session_reminder_txt",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `*${name} Ji*`,
            `*Welcome Session*`,
            welcomeSessionDate,
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
   
    return response.data;
}
