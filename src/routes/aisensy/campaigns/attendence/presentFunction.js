import axios from "axios";

const AISENSY_URL = "https://backend.aisensy.com/campaign/t1/api/v2";

const badgeMediaByDay = {
  3: {
    url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/5949123_thriveyoga3daybadge.jpg",
    filename: "thrive_yoga_3day_badge.jpg",
  },
  7: {
    url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/567638_thriveyoga7daybadge.jpg",
    filename: "thrive_yoga_7day_badge.jpg",
  },
  14: {
    url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/528811_14.jpg.jpeg",
    filename: "day14_badge",
  },
};

const getBadgeButton = (day, refUserId) => [
  {
    type: "button",
    sub_type: "URL",
    index: 0,
    parameters: [
      {
        type: "text",
        text: `/free-yoga/badge/day${day}?id=${refUserId}`,
      },
    ],
  },
];

export const presentFunction = async (
  userId,
  whatsappPhone,
  name,
  dayNumber,
  attendanceTracker = "",
  isBadgeEligible = false,
  ref_user_id = ""
) => {
  const day = Number(dayNumber);
  const weekPosition = ((day - 1) % 7) + 1;
  const tracker = attendanceTracker || `${"\u2705".repeat(weekPosition)}`;


  const defaultQuoteByDay = {
    1: "\uD83C\uDF31 Every transformation begins with one committed step.",
    2: "\uD83C\uDF3F Consistency is already taking shape.",
    4: "\uD83C\uDF3F Small daily effort is building real strength.",
    5: "\uD83D\uDC9B Discipline today builds confidence tomorrow.",
    6: "\uD83D\uDD25 You\u2019re building unstoppable momentum.",
    8: "\uD83C\uDF3F Week 2 is about identity - you are becoming consistent.",
    9: "\uD83D\uDCAA Progress is built quietly, one day at a time.",
    10: "\uD83D\uDD25 Ten days strong - this is no longer just motivation.",
    11: "\uD83C\uDF31 Discipline is turning into lifestyle.",
    12: "\uD83D\uDC9B Your consistency is something to be proud of.",
    13: "\uD83C\uDF3F You\u2019re finishing what you started - that\u2019s powerful.",
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
      quote: "\uD83C\uDF1F One full week of consistency - this is real discipline.",
    },
    14: {
      dayLine: "Day 14 completed! \uD83C\uDF89",
      badgeLine: "You have unlocked your 14-Day Achievement Badge \uD83C\uDFC5",
      quote: "\uD83D\uDC4F Fourteen days of showing up - this is the beginning of a stronger you.",
    },
  };

  const activeSpecialDay = isBadgeEligible ? specialDayConfig[day] : null;
  const isSpecialDay = Boolean(activeSpecialDay);
  const dayLine = activeSpecialDay?.dayLine || `${day} completed strong \uD83D\uDCAA`;
  const statusLine = "Present \u2714\uFE0F";
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
          "Click the button below \uD83D\uDC47 to view your badge and share your achievement with friends!",
        ],
        source: "new-landing-page form",
        media: badgeMediaByDay[day] || {},
        buttons: getBadgeButton(day, ref_user_id),
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
        templateParams: [`${name} Ji`, dayLine, "Present \u2714\uFE0F", tracker, quote],
        source: "new-landing-page form",
        media: {},
        buttons: [],
        carouselCards: [],
        location: {},
        attributes: {},
      };

  
  const response = await axios.post(AISENSY_URL, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
