import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { fiveMinWelcomeSessionRemainderEvening, fiveMinWelcomeSessionRemainderMorning } from "./campaigns/remainders/welcomeSessionRemainders.js";
import { fiveMinSessionRemainderMetabolHealth, fiveMinSessionRemainderMetabolHealthEvening } from "./campaigns/remainders/MetabolHealthSessionRemainders.js";
import { fiveMinSessionRemainder14Con, fiveMinSessionRemainder14ConEve } from "./campaigns/remainders/14ConSessionRemainders.js";
import { processPhone } from "../../utils/phoneUtils.js";


export const triggerFiveRem = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-08-31')
    .eq("is_active", true)
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await fiveMinSessionRemainderMetabolHealth({
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
    await delay(10);
  }

  console.log("> Yoga campaign finished");
};

export const triggerFiveRemEve = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-08-31')
    .eq("is_active", true)
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await fiveMinSessionRemainderMetabolHealthEvening({
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
    await delay(10);
  }

  console.log("> Yoga campaign finished");
};

export const triggerFiveRemWel = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-09-07')
    .eq("is_active", true)
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await fiveMinWelcomeSessionRemainderMorning({
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
    await delay(10);
  }

  console.log("> Yoga campaign finished");
};

export const triggerFiveRemWelEve = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-09-07')
    .eq("is_active", true)
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await fiveMinWelcomeSessionRemainderEvening({
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
    await delay(10);
  }

  console.log("> Yoga campaign finished");
};

export const triggerFive14Rem = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-08-24')
    .eq("is_active", true)
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await fiveMinSessionRemainder14Con({
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
    await delay(10);
  }

  console.log("> Yoga campaign finished");
};

export const triggerFive14RemEve = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-08-24')
    .eq("is_active", true)
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await fiveMinSessionRemainder14ConEve({
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
    await delay(10);
  }

  console.log("> Yoga campaign finished");
};