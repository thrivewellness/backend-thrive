

import axios from "axios";

export const day0SessionMorning = async ({
    whatsappPhone,
    name,
    userId,
}) => {

    console.log("received user data : ", whatsappPhone, name, userId);

    try {

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "welcome_stn_mor",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [
                `${name}`,
                `11 AM`,    
                ` 6 PM (IST)`,    
                `11:58 AM`,            
                `https://thriveyoga.thrivewellness.in/join/m/${userId}`
            ],

            source: "new-landing-page form",

            media: {
                url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/8754792_Welcome%20session.jpg.jpeg",
                filename: "Welcome session.jpg.jpeg",
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

        console.log(`Aisensy Day 0 Morning response for ${userId}:`, response.data);
        return response.data;

    } catch (error) {
        console.error(
            "AiSensy Day 0 Morning Error:",
            error?.response?.data || error.message
        );
        throw error;
    }
};

export const day0SessionEvening = async ({
    whatsappPhone,
    name,
    userId,
}) => {

    console.log("received user data : ", whatsappPhone, name, userId);

    try {

        const payload = {
            apiKey: process.env.AISENSY_API_KEY,
            campaignName: "send_eving_wel_remiander",
            destination: whatsappPhone,
            userName: "Thrive Integrated Lifestyle Private Limited",

            templateParams: [
                `${name}`,
                `11 AM`,    
                `6 PM (IST)`,   
            ],

            source: "new-landing-page form",

            media: {
                url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/8754792_Welcome%20session.jpg.jpeg",
                filename: "Welcome session.jpg.jpeg",
            },

            buttons: [
                {
                    type: "button",
                    sub_type: "URL",
                    index: 0,
                    parameters: [
                        {
                            type: "text",
                            text: `/e/${userId}`
                        }
                    ]
                }
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

        console.log(`Aisensy Day 0 Evening response for ${userId}:`, response.data);
        return response.data;

    } catch (error) {
        console.error(
            "AiSensy Day 0 Evening Error:",
            error?.response?.data || error.message
        );
        throw error;
    }
};
