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

const dailyQuotes = [
  "Today, you chose yourself. That's a victory worth celebrating. \uD83C\uDF3F",
  "Another day completed. Another promise kept to yourself. \uD83C\uDF38",
  "Well done! Your consistency deserves to be celebrated. \u2728",
  "Today's session is complete. Be proud\u2014you showed up. \uD83D\uDC9A",
  "Every attendance is proof that you're becoming unstoppable. \uD83C\uDF31",
  "You earned today's checkmark. Wear it with pride. \uD83C\uDFC5",
  "Success loves people who keep showing up. You're one of them. \u2B50",
  "You didn't just attend\u2014you invested in yourself today. \uD83D\uDC8E",
  "Every completed session is a win. Collect them proudly. \uD83C\uDFC6",
  "Great job! Today's effort counts more than you think. \uD83C\uDF1F",
  "You are building something extraordinary, one session at a time. \uD83D\uDE80",
  "This is what commitment looks like. Keep going. \uD83D\uDCAA",
  "Another day stronger. Another reason to be proud. \uD83C\uDF3C",
  "Showing up is a superpower\u2014and you used yours today. \uD83E\uDD8B",
  "Your future self is applauding today's decision. \uD83D\uDC4F",
  "Every session completed is another milestone unlocked. \uD83C\uDFAF",
  "You are officially one step ahead of yesterday. \uD83D\uDCC8",
  "Progress begins with presence. You made it happen today. \uD83C\uDF3F",
  "Today's attendance is another badge of honor. \uD83C\uDFC5",
  "Consistency looks good on you. Keep collecting these wins. \uD83C\uDF38",
  "The streak continues. So does your growth. \uD83D\uDD25",
  "Every session you complete makes your journey more inspiring. \u2728",
  "You earned today's victory. Tomorrow, we'll earn another. \uD83C\uDFC6",
  "Your commitment is becoming your greatest achievement. \uD83C\uDF1F",
  "Every checkmark tells the story of someone who refused to quit. \u2705",
  "Today's attendance isn't just a number\u2014it's a statement. \uD83D\uDC9A",
  "One more session completed. One more reason to believe in yourself. \uD83C\uDF31",
  "Keep collecting days like this. They become incredible years. \uD83C\uDF33",
  "This community grows stronger because people like you keep showing up. \uD83E\uDD1D",
  "Congratulations! Today is another chapter in your consistency story. \uD83D\uDCD6",
  "You closed out the month by showing up for yourself. That's worth celebrating. \uD83C\uDF89",
];

const getDayOfMonthIST = () =>
  Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
    }).format(new Date())
  );

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
  const dailyQuote = dailyQuotes[getDayOfMonthIST() - 1];
  const dayLine = milestoneQuote
    ? `${totalPresentDays} Thrive Yoga days completed! \uD83C\uDF89`
    : "Thank you for attending today’s session 💚";
  const quote = milestoneQuote || dailyQuote;
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
