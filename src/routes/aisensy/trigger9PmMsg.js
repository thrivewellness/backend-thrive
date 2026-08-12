import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { processPhone } from "../../utils/phoneUtils.js";
import {
  sendInstTestimonails,
  sendInstTestimonailsnew,
} from "./campaigns/intractions/sendtestimonails.js";
import { tommarowSessionRemaindersGutHealth } from "./campaigns/remainders/gutHealthSessionRemainders.js";
import { tommarowSessionRemaindersMetabolHealth } from "./campaigns/remainders/MetabolHealthSessionRemainders.js";
import { tommarowSessionRemainders14Con } from "./campaigns/remainders/14ConSessionRemainders.js";

const formatDate = (date) => date.toISOString().slice(0, 10);

const getTodayIST = () =>
  new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

const getDatePart = (dateString) => dateString?.toString().slice(0, 10);

const getDateAtUTCNoon = (dateString) => {
  const datePart = getDatePart(dateString);

  if (!datePart) {
    return new Date("invalid");
  }

  const [year, month, day] = datePart.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
};

const addDays = (dateString, days) => {
  const date = getDateAtUTCNoon(dateString);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDate(date);
};

const calculateDayNumber = (currentSessionDate, todayDate) => {
  if (!currentSessionDate || !todayDate) {
    return null;
  }

  const sessionStart = getDateAtUTCNoon(currentSessionDate);
  const today = getDateAtUTCNoon(todayDate);

  if (
    Number.isNaN(sessionStart.getTime()) ||
    Number.isNaN(today.getTime())
  ) {
    return null;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return (
    Math.floor((today - sessionStart) / millisecondsPerDay) + 1
  );
};

const getWeekPosition = (dateString) => {
  const day = getDateAtUTCNoon(dateString).getUTCDay();

  return day === 0 ? 7 : day;
};

const getMessageCampaign = (dayNumber) => {
  // Day 1 - 4
  if (dayNumber >= 1 && dayNumber <= 4) {
    return {
      name: "sendInstTestimonails",
      sender: sendInstTestimonails,
    };
  }

  // Day 5
  if (dayNumber === 5) {
    return {
      name: "tommarowSessionRemaindersGutHealth",
      sender: tommarowSessionRemaindersGutHealth,
    };
  }

  // Day 6
  if (dayNumber === 6) {
    return {
      name: "tommarowSessionRemaindersMetabolHealth",
      sender: tommarowSessionRemaindersMetabolHealth,
    };
  }

  // Day 8 - 10
  if (dayNumber >= 8 && dayNumber <= 10) {
    return {
      name: "sendInstTestimonailsnew",
      sender: sendInstTestimonailsnew,
    };
  }

  // Day 13
  if (dayNumber === 13) {
    return {
      name: "tommarowSessionRemainders14Con",
      sender: tommarowSessionRemainders14Con,
    };
  }

  return null;
};

const getTargetDayNumbers = (dayNumber, todayDate) => {
  const baseDayNumber =
    Number(dayNumber) || getWeekPosition(todayDate);

  return [baseDayNumber, baseDayNumber + 7].filter(
    (targetDayNumber) => targetDayNumber <= 14
  );
};

export const trigger9PmMsg = async (
  dayNumber,
  todaysdate = getTodayIST()
) => {
  const todayDate = getDatePart(todaysdate);

  const targetDayNumbers = getTargetDayNumbers(
    dayNumber,
    todayDate
  );

  const targetSessionDates = targetDayNumbers.map(
    (targetDayNumber) =>
      addDays(todayDate, -(targetDayNumber - 1))
  );

  console.log("> 9 PM campaign started");
  console.log("> today date:", todayDate);
  console.log(">  day number:", dayNumber);
  console.log(
    "> target day numbers:",
    targetDayNumbers.join(", ")
  );
  console.log(
    "> target session dates:",
    targetSessionDates.join(", ")
  );

  const { data: users, error } = await supabase
    .from("yoga_signups")
    .select("*")
    .in("current_session_date", targetSessionDates)
    .eq("is_active", true)
    .order("id", { ascending: false });

  if (error) {
    console.error("Supabase Fetch Error:", error);
    return;
  }

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  let successCount = 0;
  let failureCount = 0;
  let skippedCount = 0;

  const campaignStats = {};

  const getCampaignStats = (
    userDayNumber,
    campaignName
  ) => {
    const key = `day ${userDayNumber} - ${campaignName}`;

    if (!campaignStats[key]) {
      campaignStats[key] = {
        dayNumber: userDayNumber,
        campaignName,
        matchedUsers: 0,
        successCount: 0,
        failureCount: 0,
      };
    }

    return campaignStats[key];
  };

  for (const user of users) {
    const userDayNumber = calculateDayNumber(
      user.current_session_date,
      todayDate
    );

    if (!targetDayNumbers.includes(userDayNumber)) {
      continue;
    }

    const campaign = getMessageCampaign(
      userDayNumber
    );

    if (!campaign) {
      skippedCount++;

      console.log(
        `> Skipping user ${user.id}; no 9 PM message for day ${userDayNumber}`
      );

      continue;
    }

    const stats = getCampaignStats(
      userDayNumber,
      campaign.name
    );

    stats.matchedUsers++;

    const phoneData = processPhone(
      user.phone,
      user.country_code
    );

    const { whatsappPhone } = phoneData;

    try {
      await campaign.sender({
        userId: user.id,
        whatsappPhone,
        name: user.name,
        dayNumber: userDayNumber,
      });

      successCount++;
      stats.successCount++;

      console.log(
        `> Sent ${campaign.name} to ${user.id} for day ${userDayNumber}`
      );
    } catch (err) {
      failureCount++;
      stats.failureCount++;

      console.error(
        `> Failed ${campaign.name} for ${user.id} day ${userDayNumber}`,
        err.message
      );
    }

    // WhatsApp safety delay
    await delay(10);
  }

  console.log("> 9 PM campaign finished");

  console.log(
    `> Total matched users: ${users.length}`
  );

  console.log(
    `> Successfully sent: ${successCount}`
  );

  console.log(
    `> Failed: ${failureCount}`
  );

  console.log(
    `> Skipped because no campaign configured: ${skippedCount}`
  );

  Object.values(campaignStats).forEach(
    (stats) => {
      console.log(
        `> Campaign summary: day ${stats.dayNumber} | ${stats.campaignName} | matched ${stats.matchedUsers} | sent ${stats.successCount} | failed ${stats.failureCount}`
      );
    }
  );
};
