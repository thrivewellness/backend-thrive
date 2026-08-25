import axios from "axios";

const AISENSY_URL = "https://backend.aisensy.com/campaign/t1/api/v2";

const milestoneQuotes = {
  50: "\uD83C\uDF89 Fifty days of showing up - your consistency is inspiring.",
  100: "\uD83C\uDFC6 One hundred yoga days - an incredible achievement.",
  200: "\uD83C\uDF1F Two hundred days of commitment have built a powerful habit.",
  300: "\uD83D\uDC4F Three hundred yoga days - your discipline is exceptional.",
  500: "\uD83C\uDFC5 Five hundred days of wellness, strength, and consistency.",
  1000: "\uD83C\uDF89 One thousand yoga days - a truly remarkable journey.",
  1500: "\uD83C\uDF1F Fifteen hundred days of dedication - keep inspiring us.",
  2000: "\uD83C\uDFC6 Two thousand yoga days - an extraordinary milestone.",
  2500: "\uD83D\uDC4F Twenty-five hundred yoga days - a legacy of consistency.",
};

export const presentFunctionPaid = async (
  userId,
  whatsappPhone,
  name,
  dayNumber,
  attendanceTracker = "",
  totalPresentDays = 0,
  isMilestone = false
) => {
  const day = Number(dayNumber);
  const tracker = attendanceTracker || "\u2705";
  const milestoneQuote = isMilestone ? milestoneQuotes[totalPresentDays] : null;
  const dayLine = milestoneQuote
    ? `${totalPresentDays} Thrive Yoga days completed! \uD83C\uDF89`
    : `Thankyou for attending today’s session 💚`;
  const quote = milestoneQuote || "\uD83C\uDF3F Keep showing up. You are doing great.";
  const statusLine = "Present \u2714\uFE0F";

  const payload = milestoneQuote
    ? {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "attendance_badge",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",
        templateParams: [
          `${name || "user"} Ji`,
          dayLine,
          statusLine,
          `You have unlocked your ${totalPresentDays}-Day Achievement Badge \uD83C\uDFC5`,
          quote,
          tracker,
          "Celebrate this milestone and share your achievement with friends!",
        ],
        source: "new-landing-page form",
        media: {},
        buttons: [],
        carouselCards: [],
        location: {},
        attributes: {},
        paramsFallbackValue: {
          FirstName: "user",
        },
      }
    : {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "present_msg_both_users",
        destination: whatsappPhone,
        userName: "Thrive Wellness",
        templateParams: [
          `${name || "user"} Ji`,
          dayLine,
          statusLine,
          tracker,
          `Total Thrive yoga days: ${totalPresentDays}`,
          quote,
        ],
        source: "new-landing-page form",
        media: {},
        buttons: [],
        carouselCards: [],
        location: {},
        attributes: {},
      };

  try {
    const response = await axios.post(AISENSY_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (err) {
    console.error("AiSensy paid present campaign failed:", {
      userId,
      dayNumber: day,
      totalPresentDays,
      status: err.response?.status,
      response: err.response?.data,
    });
    throw err;
  }
};
