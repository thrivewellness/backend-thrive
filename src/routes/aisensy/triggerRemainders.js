import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { fiveMinSessionRemainderGutHealth, fiveMinSessionRemainderGutHealthEvening, liveNowRemainderGutHealth, tommarowSessionRemaindersGutHealth } from "./campaigns/remainders/gutHealthSessionRemainders.js";
import { tommarowDay1SessionRemainders, tommarowWelcomeSessionRemainder } from "./campaigns/remainders/tommarowSessionRemainders.js";
import { fiveMinWelcomeSessionRemainderEvening, fiveMinWelcomeSessionRemainderMorning, liveNowRemainder } from "./campaigns/remainders/welcomeSessionRemainders.js";
import { fiveMinSessionRemainderMetabolHealth, fiveMinSessionRemainderMetabolHealthEvening, liveNowRemainderMetabolHealth, tommarowSessionRemaindersMetabolHealth } from "./campaigns/remainders/MetabolHealthSessionRemainders.js";
import { fiveMinSessionRemainder14Con, fiveMinSessionRemainder14ConEve, tommarowSessionRemainders14Con } from "./campaigns/remainders/14ConSessionRemainders.js";
import { processPhone } from "../../utils/phoneUtils.js";


export const triggerFiveRem = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-07-13')
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
      await fiveMinSessionRemainderGutHealth({
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
    .eq("current_session_date", '2026-07-13')
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
      await fiveMinSessionRemainderGutHealthEvening({
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


export const triggerTommarowrem = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-07-13')
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
      await tommarowSessionRemaindersGutHealth({
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
    await delay(100);
  }

  console.log("> Yoga campaign finished");
};


export const triggerLiveNowRem = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-07-13')
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

    await delay(10);
  }

  console.log("> Yoga campaign finished");
};

export const triggerTommarowremmetabolic = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-07-13')
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
      await tommarowSessionRemaindersMetabolHealth({
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
    await delay(200);
  }

  console.log("> Yoga campaign finished");
};

export const triggerTommarowrem14con = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-07-13')
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
      await tommarowSessionRemainders14Con({
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
    await delay(200);
  }

  console.log("> Yoga campaign finished");
};


export const triggerFiveRemWel = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .gt("id", 6103)
    .order("id", { ascending: false })
    .range(0, 9999);

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
    .gt("id", 6103)
    .order("id", { ascending: false })
    .range(0, 9999);

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
