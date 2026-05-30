import axios from "axios";

export const presentFunction = async (userId, whatsappPhone, name, dayNumber) => {
  const day = Number(dayNumber);
  const weekPosition = ((day - 1) % 7) + 1;
  const completedCount = Math.max(0, Math.min(weekPosition, 6));
  const tracker = `${"\u2705".repeat(completedCount)}${"\u2B1C".repeat(6 - completedCount)}`;

  const defaultQuoteByDay = {
    1: "\uD83C\uDF31 Every transformation begins with one committed step.",
    2: "\uD83C\uDF3F Consistency is already taking shape.",
    4: "\uD83C\uDF3F Small daily effort is building real strength.",
    5: "\uD83D\uDC9B Discipline today builds confidence tomorrow.",
    6: "\uD83D\uDD25 You\u2019re building unstoppable momentum.",
    8: "\uD83C\uDF3F Week 2 is about identity \u2014 you are becoming consistent.",
    9: "\uD83D\uDCAA Progress is built quietly, one day at a time.",
    10: "\uD83D\uDD25 Ten days strong \u2014 this is no longer just motivation.",
    11: "\uD83C\uDF31 Discipline is turning into lifestyle.",
    12: "\uD83D\uDC9B Your consistency is something to be proud of.",
    13: "\uD83C\uDF3F You\u2019re finishing what you started \u2014 that\u2019s powerful.",
  };

  const specialDayConfig = {
    3: {
      dayLine: "Day 3 completed! \uD83C\uDF89",
      badgeLine: "You have unlocked your 3-Day Badge \uD83C\uDFC5",
      quote: "\u2728 Momentum has officially begun.",
    },
    7: {
      dayLine: "Day 7 completed! \uD83C\uDF89",
      badgeLine: "You have unlocked your 7-Day Streak Badge \uD83C\uDFC5",
      quote: "\uD83C\uDF1F One full week of consistency \u2014 this is real discipline.",
    },
    14: {
      dayLine: "Day 14 completed! \uD83C\uDF89",
      badgeLine: "You have unlocked your 14-Day Achievement Badge \uD83C\uDFC5",
      quote: "\uD83D\uDC4F Fourteen days of showing up - this is the beginning of a stronger you.",
    },
  };

  const activeSpecialDay = specialDayConfig[day];

  const isSpecialDay = Boolean(activeSpecialDay);
  const dayLine = activeSpecialDay?.dayLine || `Day ${day} completed strong \uD83D\uDCAA`;
  const statusLine = "\u2714\uFE0F";
  const badgeLine = activeSpecialDay?.badgeLine || "";
  const quote = activeSpecialDay?.quote || defaultQuoteByDay[day] || "\uD83C\uDF3F Keep showing up. You are doing great.";

  const payload = isSpecialDay
    ? {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "attendance_badge",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",
        templateParams: [
          `${name} Ji`,
          dayLine,
          statusLine,
          badgeLine,
          quote,
          tracker,
          `Click the button below to view your badge and share your achievement with friends!`,
        ],
        source: "new-landing-page form",
        media: {
          url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/6353da2e153a147b991dd812/4958901_highanglekidcheatingschooltestmin.jpg",
          filename: "sample_media",
        },
        buttons: [
          {
            type: "button",
            sub_type: "URL",
            index: 0,
            parameters: [
              {
                type: "text",
                text: `${name || "user"}`,
              },
            ],
          },
        ],
        carouselCards: [],
        location: {},
        attributes: {},
        paramsFallbackValue: {
          FirstName: "user",
        },
      }
    : {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "present_free_yoga",
        destination: whatsappPhone,
        userName: "Thrive Wellness",
        templateParams: [`${name} Ji`, dayLine, `Present ✔️`, tracker, quote],
        source: "new-landing-page form",
        media: {},
        buttons: [],
        carouselCards: [],
        location: {},
        attributes: {},
      };

  const response = await axios.post("https://backend.aisensy.com/campaign/t1/api/v2", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
