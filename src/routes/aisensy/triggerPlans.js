import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { sendThriveYogaPlansMessage } from "./campaigns/promtions/sendThriveYogaPlansMessage.js";
import { sendThriveYogaPlans1day } from "./campaigns/promtions/sendThriveYogaPlans1day.js";
import { sendChineseMsg } from "./campaigns/promtions/sendChineseMsg.js";
import { sendThriveYogaPlans2day } from "./campaigns/promtions/sendThriveYogaPlans2day.js";
import { sendThriveconsultaion3day } from "./campaigns/promtions/sendThriveconsultaion3day.js";
import { processPhone } from "../../utils/phoneUtils.js";
import { sendMisCallFromHealth } from "./campaigns/promtions/sendMisCallFromHealth.js";
import { sendVideoMessage15day } from "./campaigns/promtions/sendVideoMessage15day.js";

const PLAN_CAMPAIGNS_BY_WEEKDAY = {
  1: { programDay: 15, sender: sendThriveYogaPlansMessage },
  2: { programDay: 16, sender: sendMisCallFromHealth },
  3: { programDay: 17, sender: sendChineseMsg },
  4: { programDay: 11, sender: sendThriveconsultaion3day },
  5: { programDay: 12, sender: sendThriveYogaPlans2day },
  6: { programDay: 13, sender: sendThriveYogaPlans1day },
};

const getTodayIST = () =>
  new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

const subtractDays = (dateString, numberOfDays) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  date.setUTCDate(date.getUTCDate() - numberOfDays);
  return date.toISOString().slice(0, 10);
};

const getWhatsappPhone = (user) =>
  processPhone(user.phone, user.country_code)?.whatsappPhone || null;

const getPaidNumbers = async () => {
  const { data: paidUsers, error } = await supabase
    .from("paid_users")
    .select("country_code, phone");

  if (error) throw error;

  return new Set(
    (paidUsers || []).map(getWhatsappPhone).filter(Boolean)
  );
};

// Plans Trigger Function
export const triggerPlans = async (dayNumber, todaysDate = getTodayIST()) => {
  console.log("> Running Plans Function");
  try {
    const campaign = PLAN_CAMPAIGNS_BY_WEEKDAY[Number(dayNumber)];

    if (!campaign) {
      console.warn(`> No plans campaign configured for weekday ${dayNumber}`);
      return;
    }

    const { programDay, sender } = campaign;
    const currentSessionDate = subtractDays(todaysDate, programDay - 1);

    console.log(`> Program day: ${programDay}`);
    console.log(`> Target session date: ${currentSessionDate}`);

    // Fetch users from yoga_signups
    let usersQuery = supabase
      .from("yoga_signups")
      .select("*")
      .eq("current_session_date", currentSessionDate);

    // Monday and Thursday include inactive users; all other weekdays do not.
    if (![1, 4].includes(Number(dayNumber))) {
      usersQuery = usersQuery.eq("is_active", true);
    }

    usersQuery = usersQuery.order("id", { ascending: false });

    const { data: users, error } = await usersQuery;

    if (error) {
      console.error("Supabase Fetch Error:", error);
      return;
    }

    const paidNumbers = await getPaidNumbers();

    let sentCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      const { id, name } = user;

      const whatsappPhone = getWhatsappPhone(user);

      if (!whatsappPhone) {
        skippedCount++;
        console.log(`> Skipping user with invalid phone: ${id}`);
        continue;
      }

      // Skip users who have already purchased a plan
      if (paidNumbers.has(whatsappPhone)) {
        skippedCount++;
        console.log(`> Skipping paid user: ${id} (${whatsappPhone})`);
        continue;
      }

      try {
        await sender(id, whatsappPhone, name, programDay);
        sentCount++;
      } catch (err) {
        console.error(`> Failed for user ${id}:`, err.message);
      }

      await delay(300);
    }

    console.log(`> Total Sent: ${sentCount}`);
    console.log(`> Total Skipped: ${skippedCount}`);
  } catch (err) {
    console.error("Trigger Plans Error:", err);
  }
};

const SUNDAY_MESSAGE_ACTIVITY_TYPE = "sunday_day_14_message";

const hasSundayMessage = (activity, date, sessionType) =>
  Array.isArray(activity) &&
  activity.some(
    (item) =>
      item?.type === SUNDAY_MESSAGE_ACTIVITY_TYPE &&
      item?.date === date &&
      item?.session_type === sessionType &&
      item?.sent === true
  );

const markSundayMessageSent = async (user, date, sessionType) => {
  const activity = Array.isArray(user.activity) ? user.activity : [];
  const sentAt = new Date().toISOString();

  const { error } = await supabase
    .from("yoga_signups")
    .update({
      activity: [
        ...activity,
        {
          type: SUNDAY_MESSAGE_ACTIVITY_TYPE,
          date,
          session_type: sessionType,
          sent: true,
          sent_at: sentAt,
        },
      ],
    })
    .eq("id", user.id);

  if (error) throw error;
};

export const triggerPlansSunday = async (
  sessionType,
  todaysDate = getTodayIST()
) => {
  console.log("> Running Plans Sunday Function");
  console.log(`> Session Type: ${sessionType}`);

  if (!["morning", "evening"].includes(sessionType)) {
    console.warn(`> Invalid Sunday session type: ${sessionType}`);
    return;
  }

  const programDay = 14;
  const currentSessionDate = subtractDays(todaysDate, programDay - 1);

  console.log(`> Program day: ${programDay}`);
  console.log(`> Target session date: ${currentSessionDate}`);

  try {
    const query = supabase
      .from("yoga_signups")
      .select("id, name, phone, country_code, attendance, activity, is_active")
      .eq("current_session_date", currentSessionDate)
      .eq("is_active", true)
      .order("id", { ascending: false });

    const { data: users, error } = await query;

    if (error) {
      console.error("Supabase Fetch Error:", error);
      return;
    }

    if (!users?.length) {
      console.log("> No program day 14 users found");
      return;
    }

    const paidNumbers = await getPaidNumbers();

    let sentCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      const attendedToday =
        Array.isArray(user.attendance) && user.attendance.includes(todaysDate);
      const receivedMorningMessage = hasSundayMessage(
        user.activity,
        todaysDate,
        "morning"
      );
      const alreadyReceivedThisSession = hasSundayMessage(
        user.activity,
        todaysDate,
        sessionType
      );
      const whatsappPhone = getWhatsappPhone(user);
      const isPaidUser = paidNumbers.has(whatsappPhone);

      if (
        !whatsappPhone ||
        isPaidUser ||
        alreadyReceivedThisSession ||
        (sessionType === "morning" && !attendedToday) ||
        (sessionType === "evening" && receivedMorningMessage)
      ) {
        skippedCount++;
        continue;
      }

      try {
        await sendVideoMessage15day(
          user.id,
          whatsappPhone,
          user.name,
          programDay
        );
        await markSundayMessageSent(user, todaysDate, sessionType);
        sentCount++;
      } catch (err) {
        console.error(`> Failed for user ${user.id}:`, err.message);
      }

      await delay(300);
    }

    console.log(`> Total Sent: ${sentCount}`);
    console.log(`> Total Skipped: ${skippedCount}`);
  } catch (err) {
    console.error("Trigger Plans Sunday Error:", err);
  }
};
