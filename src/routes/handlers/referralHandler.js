import axios from "axios";
import { supabase } from '../../lib/supabase.js';

export const handleReferralCount = async (userId, userName, referral, count, whatsappPhone) => {

    try {
        if (count === 1) {
            await sendRewardOne({
                userName,
                whatsappPhone,
                referral,
                userId
            });
        }

        if (count === 3) {
            await sendRewardThree({
                userName,
                whatsappPhone,
                referral,
                userId
            });
        }

    } catch (error) {
        console.error("Referral Handler Error:", error.message);
    }
};





/* =========================
   REWARD → 1 REFERRAL
   ========================= */
const sendRewardOne = async ({ userName, whatsappPhone, referral, userId }) => {
   

    const { data: refUser, error: refUserError } = await supabase
        .from("yoga_signups")
        .select("id, name, phone, country_code")
        .eq("ref_user_id", referral)
        .single();

    if (refUserError || !refUser) {
        console.error("Ref User Fetch Error:", refUserError?.message);
        return;
    }

    console.log(refUser);

    // Format destination number properly
    let countryCode = refUser.country_code || "";
    let phone = refUser.phone || "";

    // Remove spaces
    countryCode = countryCode.trim();
    phone = phone.trim();

    let destination = "";

    if (countryCode === "+91") {
        // Remove + for India
        destination = `91${phone}`;
    } else {
        // Remove + if exists, then combine
        destination = `${countryCode.replace("+", "")}${phone}`;
    }

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "reffrel_rewards",
        destination: destination, // fixed here
        userName: "Thrive Wellness",

        templateParams: [
            `${String(refUser.name)} Ji 🙏`,
            `${String(userName)}`,
            "high protein chart 🎁",
        ],

        buttons: [
            {
                type: "button",
                sub_type: "URL",
                index: 0,
                parameters: [
                    {
                        type: "text",
                        text: `/high-protein/${referral}`
                    }
                ]
            }
        ],

        media: {},
        attributes: {},
    };

    await fireAiSensy(payload);
};






/* =========================
   REWARD → 3 REFERRALS
   ========================= */

const sendRewardThree = async ({ userName, whatsappPhone, referral, userId }) => {
    

    const { data: refUser, error: refUserError } = await supabase
        .from("yoga_signups")
        .select("id, name, phone, country_code")
        .eq("ref_user_id", referral)
        .single();

    if (refUserError || !refUser) {
        console.error("Ref User Fetch Error:", refUserError?.message);
        return;
    }

    console.log(refUser);

    //  Format destination number properly
    let countryCode = refUser.country_code || "";
    let phone = refUser.phone || "";

    // Remove spaces
    countryCode = countryCode.trim();
    phone = phone.trim();

    let destination = "";

    if (countryCode === "+91") {
        // Remove + for India
        destination = `91${phone}`;
    } else {
        // Remove + if exists, then combine
        destination = `${countryCode.replace("+", "")}${phone}`;
    }

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "reffrel_rewards",
        destination: destination, // ✅ fixed here
        userName: "Thrive Wellness",

        templateParams: [
            `${String(refUser.name)} Ji 🙏`,
           `${String(userName)} and 2 more friends`,
            "Gut Health PDF 🎁",
        ],

        buttons: [
            {
                type: "button",
                sub_type: "URL",
                index: 0,
                parameters: [
                    {
                        type: "text",
                        text: `/gut-health/${referral}`
                    }
                ]
            }
        ],

        media: {},
        attributes: {},
    };

    await fireAiSensy(payload);
};





/* =========================
   COMMON API CALL
   ========================= */

const fireAiSensy = async (payload) => {
    try {
        const response = await axios.post(
            "https://backend.aisensy.com/campaign/t1/api/v2",
            payload,
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("✅ AiSensy Response:", response.data);
        return response.data;

    } catch (error) {
        console.error(
            "❌ AiSensy Error:",
            error?.response?.data || error.message
        );
    }
};
