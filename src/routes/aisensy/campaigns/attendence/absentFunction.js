import axios from "axios";
import { supabase } from "../../../../lib/supabase.js";

const AISENSY_URL = "https://backend.aisensy.com/campaign/t1/api/v2";

const getDisplayName = (name) => `*${name || "user"} Ji* 👋`;

const buildUrlButton = (text) => [
  {
    type: "button",
    sub_type: "URL",
    index: 0,
    parameters: [
      {
        type: "text",
        text: `/free-yoga/reactivate?id=${text}`
      }
    ],
  },
];

const buildPayload = ({ campaignName, whatsappPhone, templateParams, buttons = [] }) => ({
  apiKey: process.env.AISENSY_API_KEY,
  campaignName,
  destination: whatsappPhone,
  userName: "Thrive Integrated Lifestyle Private Limited",
  templateParams,
  source: "new-landing-page form",
  media: {},
  buttons,
  carouselCards: [],
  location: {},
  attributes: {},
  paramsFallbackValue: {
    FirstName: "user",
  },
});

const sendCampaign = async (payload) => {

   const response = await axios.post(AISENSY_URL, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

const deactivateUser = async (userId) => {
  
  const { error } = await supabase.from("yoga_signups").update({ is_active: false }).eq("id", userId);

  if (error) {
    throw error;
  }
};

const sendOneDayAbsentCampaign = async ({ whatsappPhone, name }) => {
  const payload = buildPayload({
    campaignName: "absent_free_yoga",
    whatsappPhone,
    templateParams: [getDisplayName(name)],
  });

  return sendCampaign(payload);
};

const sendTwoDayAbsentCampaign = async ({ whatsappPhone, name }) => {
  const payload = buildPayload({
    campaignName: "absent_in_row",
    whatsappPhone,
    templateParams: [
      getDisplayName(name),
      "the last 2 consecutive yoga sessions 🚫",
      "⚠️ To keep your *Thrive Yoga Program* active, please join tomorrow's session. We'd love to support you on your wellness journey! 💚",
    ],
  });

  return sendCampaign(payload);
};

const sendThreeDayAbsentCampaign = async ({ userId, whatsappPhone, name, ref_user_id }) => {
  const payload = buildPayload({
    campaignName: "absent_3_day",
    whatsappPhone,
    templateParams: [
      getDisplayName(name),
      "last 3 days 🚫",
      "As we haven't seen regular participation recently, your *Thrive Yoga Program* 🧘‍♀️ has been temporarily paused ⏸️",
      "🌱 It's never too late to get back on track with your healthy habits! 👇 Click the button below to *reactivate* your thrive yoga journey and continue working toward your wellness goals 💪"
    ],
    buttons: buildUrlButton(String(ref_user_id)),
  });

  const response = await sendCampaign(payload);
  await deactivateUser(userId);

  return response;
};

export const absentFunction = async (userId, whatsappPhone, name, dayNumber, consecutiveAbsentCount = 1, ref_user_id) => {
  const absentCount = Number(consecutiveAbsentCount) || 1;

  try {
    if (absentCount >= 3) {
      const response = await sendThreeDayAbsentCampaign({ userId, whatsappPhone, name, ref_user_id });
      return response;
    }

    if (absentCount === 2) {
      return sendTwoDayAbsentCampaign({ whatsappPhone, name });
    }

    return sendOneDayAbsentCampaign({ whatsappPhone, name });
  } catch (err) {
    console.error("AiSensy absent campaign failed:", {
      userId,
      dayNumber,
      consecutiveAbsentCount: absentCount,
      status: err.response?.status,
      response: err.response?.data,
    });
    throw err;
  }
};
