import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { fiveMinSessionRemainder, liveNowRemainder } from "./campaigns/remainders/welcomeSessionRemainders.js";

const YOGA_CAMPAIGN_JOIN_WELCOME_CUTOFF = "2026-04-19T23:59:59Z";

export const triggerFiveRem = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .gt("created_at", YOGA_CAMPAIGN_JOIN_WELCOME_CUTOFF)
    .order("created_at", { ascending: false })
    .range(0, 5000);

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await fiveMinSessionRemainder({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
        dayNumber
      });

      console.log(`> Sent to ${user.id}`);
    } catch (err) {
      console.error(`> Failed for ${user.id}`, err.message);
    }

    // WhatsApp safety delay
    await delay(200);
  }

  console.log("> Yoga campaign finished");
};


export const triggerLiveNowRem = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("id", 403)
    .gt("created_at", YOGA_CAMPAIGN_JOIN_WELCOME_CUTOFF)
    .order("created_at", { ascending: false })
    .range(0, 5000);


  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await liveNowRemainder({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
        dayNumber
      });

      console.log(`> Sent to ${user.id}`);
    } catch (err) {
      console.error(`> Failed for ${user.id}`, err.message);
    }

    await delay(200);
  }

  console.log("> Yoga campaign finished");
};