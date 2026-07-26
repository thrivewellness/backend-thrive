import axios from "axios";
import { paidSessionDetailsByDay } from "./paidSessionDetailsByDay.js";

const getPaidSessionDetails = (dayNumber) => {
    const day = Number(dayNumber);
    return paidSessionDetailsByDay[day] || paidSessionDetailsByDay[1];
};

export const PaidUsersMsgMorning = async ({
    whatsappPhone,
    name,
    userId,
    dayNumber
}) => {

    console.log("recvied user data paid morning: ", whatsappPhone, name, userId, dayNumber)
    const sessionDetails = getPaidSessionDetails(dayNumber);
   
   
    try {

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "morning_session_message_paid",
            destination: whatsappPhone,
            userName: "Thrive Wellness",

            templateParams: [
                `${name} Ji ☀️`,
                "🎯 Focus",
                sessionDetails.topic
            ],

            source: "new-landing-page form",

            media: sessionDetails.morningMedia,
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
        console.log(`Aisensy response for ${userId}:`, response.data)
        return response.data;
    } catch (error) {
        console.error(
            "AiSensy Welcome Morning Error:",
            error?.response?.data || error.message
        );
        throw error;
    }
};

export const PaidUsersMsgEvening = async ({
    whatsappPhone,
    name,
    userId,
    dayNumber
}) => {

    console.log("recvied user data paid evening: ", whatsappPhone, name, userId, dayNumber)
    const sessionDetails = getPaidSessionDetails(dayNumber);

    try {

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "evening_session_message_paid",
            destination: whatsappPhone,
            userName: "Thrive Wellness",

            templateParams: [
                `${name}`,
                "Morning",
                "5:30 PM | 6:30 PM | 7:30 PM (IST)"
            ],

            source: "new-landing-page form",

            media: sessionDetails.eveningMedia,
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
        console.log(`Aisensy response for ${userId}:`, response.data)
        return response.data;
    } catch (error) {
        console.error(
            "AiSensy Welcome Morning Error:",
            error?.response?.data || error.message
        );
        throw error;
    }
};
