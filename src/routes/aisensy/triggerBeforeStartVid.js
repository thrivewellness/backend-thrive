import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { processPhone } from "../../utils/phoneUtils.js";
import { sendYtVid } from "./campaigns/intractions/sendtYtVid.js";
import { tommarowDay1SessionRemainders, tommarowWelcomeSessionRemainder } from "./campaigns/remainders/tommarowSessionRemainders.js";

export const triggerYtVid = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number:", dayNumber);

  // Get today's date in IST
  const now = new Date();

  const istDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // e.g. "2026-08-06"

  // 00:00:00 IST converted to UTC
  const startOfTodayIST = new Date(`${istDate}T00:00:00+05:30`);

  const { data: users, error } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", "2026-08-10")
    .lt("created_at", startOfTodayIST.toISOString())
    .order("id", { ascending: false });

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
      await sendYtVid({
        whatsappPhone,
        name: user.name,
        dayNumber,
        todayDate: istDate, // Pass today's IST date
      });

      successCount++;
      console.log(`> Sent to ${user.id}`);
    } catch (err) {
      failureCount++;
      console.error(`> Failed for ${user.id}`, err.message);
    }

    await delay(20);
  }

  console.log("> Yoga campaign finished");
  console.log(`> Total users: ${users.length}`);
  console.log(`> Successfully sent: ${successCount}`);
  console.log(`> Failed: ${failureCount}`);
};

export const triggerSessionsRem = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-08-10')
    .eq("is_active", true)
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  let count = 0;
  for (const user of users) {
    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await tommarowWelcomeSessionRemainder({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
        dayNumber
      });

      console.log(`> Sent to ${user.id}`);
      count++;
    } catch (err) {
      console.error(`> Failed for ${user.id}`, err.message);
    }

    // WhatsApp safety delay

    console.log("count: ", count);
    await delay(10);
  }

  console.log("> Yoga campaign finished");
};