import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { processPhone } from "../../utils/phoneUtils.js";
import { sendYtVid } from "./campaigns/intractions/sendtYtVid.js";
import { tommarowDay1SessionRemainders, tommarowWelcomeSessionRemainder } from "./campaigns/remainders/tommarowSessionRemainders.js";

const formatISTDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

const parseDateAsUTC = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
};

const toDateString = (date) => date.toISOString().slice(0, 10);

const getUpcomingMonday = (todayIST) => {
  const today = parseDateAsUTC(todayIST);
  const dayOfWeek = today.getUTCDay();
  const daysUntilMonday = (8 - dayOfWeek) % 7 || 7;

  return {
    date: toDateString(addDays(today, daysUntilMonday)),
    daysLeft: daysUntilMonday,
    dayOfWeek,
  };
};

const getUsersForUpcomingMonday = async (upcomingMondayDate, startOfTodayIST) =>
  supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", upcomingMondayDate)
    .lt("created_at", startOfTodayIST.toISOString())
    .order("id", { ascending: false });


export const triggerUpcomingMondayPreStartCampaign = async () => {
  
  const istDate = formatISTDate();
  const startOfTodayIST = new Date(`${istDate}T00:00:00+05:30`);
  const upcomingMonday = getUpcomingMonday(istDate);

  const { data: users, error } = await getUsersForUpcomingMonday(
    upcomingMonday.date,
    startOfTodayIST
  );

  if (error) {
    console.error(error);
    return;
  }

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  let successCount = 0;
  let failureCount = 0;

  for (const user of users) {
    const phoneData = processPhone(user.phone, user.country_code);
    const { whatsappPhone } = phoneData;

    try {
      if (upcomingMonday.dayOfWeek >= 1 && upcomingMonday.dayOfWeek <= 5) {
        await sendYtVid({
          whatsappPhone,
          name: user.name,
          dayNumber: upcomingMonday.dayOfWeek,
          todayDate: istDate,
          session_startdate: upcomingMonday.date,
          daysaleft: upcomingMonday.daysLeft,
        });
      } else if (upcomingMonday.dayOfWeek === 6) {
        await tommarowWelcomeSessionRemainder({
          whatsappPhone,
          name: user.name,
          userId: user.ref_user_id,
          dayNumber: 0,
          session_startdate: upcomingMonday.date,
        });
      } else if (upcomingMonday.dayOfWeek === 0) {
        await tommarowDay1SessionRemainders({
          whatsappPhone,
          name: user.name,
          userId: user.ref_user_id,
          dayNumber: 1,
          session_startdate: upcomingMonday.date,
        });
      }

      successCount++;
      console.log(`> Sent to ${user.id}`);
    } catch (err) {
      failureCount++;
      console.error(`> Failed for ${user.id}`, err.message);
    }

    await delay(20);
  }
};
