import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { processPhone } from "../../utils/phoneUtils.js";
import { send15MinDrill } from "./campaigns/intractions/send15MinDrill.js";
import { sendInstTestimonails, sendInstTestimonailsnew } from "./campaigns/intractions/sendtestimonails.js";
import { sendYtVid } from "./campaigns/intractions/sendtYtVid.js";
import { sendtYtVidManual } from "./campaigns/intractions/sendtYtVidManual.js";

export const triggerInstTestimonails = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number:", dayNumber);

  const { data: users, error } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-07-20')
    .eq("is_active", true)
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  let successCount = 0;
  let failureCount = 0;

  for (const user of users) {
    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await sendInstTestimonails({
        whatsappPhone,
        name: user.name,
        dayNumber,
      });

      successCount++;
      console.log(`> Sent to ${user.id}`);
    } catch (err) {
      failureCount++;
      console.error(`> Failed for ${user.id}`, err.message);
    }

    // WhatsApp safety delay
    await delay(10);
  }

  console.log("> Yoga campaign finished");
  console.log(`> Total users: ${users.length}`);
  console.log(`> Successfully sent: ${successCount}`);
  console.log(`> Failed: ${failureCount}`);
};

export const triggerInstTestimonailsNew = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number:", dayNumber);

  const { data: users, error } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-08-03')
    .eq("is_active", true)
    .order("id", { ascending: false });


  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  let successCount = 0;
  let failureCount = 0;

  for (const user of users) {
    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await sendInstTestimonailsnew({
        whatsappPhone,
        name: user.name,
        dayNumber,
      });

      successCount++;
      console.log(`> Sent to ${user.id}`);
    } catch (err) {
      failureCount++;
      console.error(`> Failed for ${user.id}`, err.message);
    }

    // WhatsApp safety delay
    await delay(10);
  }

  console.log("> Yoga campaign finished");
  console.log(`> Total users: ${users.length}`);
  console.log(`> Successfully sent: ${successCount}`);
  console.log(`> Failed: ${failureCount}`);
};


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
  }).format(now);

  // 00:00:00 IST converted to UTC
  const startOfTodayIST = new Date(`${istDate}T00:00:00+05:30`);

  const { data: users, error } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", "2026-08-03")
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
