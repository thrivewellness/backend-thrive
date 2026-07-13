import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { send15MinDrill } from "./campaigns/intractions/send15MinDrill.js";
import { sendInstTestimonails } from "./campaigns/intractions/sendtestimonails.js";
import { sendYtVid } from "./campaigns/intractions/sendtYtVid.js";

export const triggerInstTestimonails = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number:", dayNumber);

  const { data: users, error } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-07-13')
    .eq("is_active", true)
    .order("id", { ascending: false });


  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  let successCount = 0;
  let failureCount = 0;

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

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
    await delay(200);
  }

  console.log("> Yoga campaign finished");
  console.log(`> Total users: ${users.length}`);
  console.log(`> Successfully sent: ${successCount}`);
  console.log(`> Failed: ${failureCount}`);
};


export const triggerYtVid = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number:", dayNumber);

  const { data: users, error } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("id", 7829)


  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  let successCount = 0;
  let failureCount = 0;

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await send15MinDrill({
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
    await delay(20);
  }

  console.log("> Yoga campaign finished");
  console.log(`> Total users: ${users.length}`);
  console.log(`> Successfully sent: ${successCount}`);
  console.log(`> Failed: ${failureCount}`);
};
