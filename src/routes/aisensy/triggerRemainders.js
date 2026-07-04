import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { fiveMinSessionRemainderGutHealth, fiveMinSessionRemainderGutHealthEvening, liveNowRemainderGutHealth, tommarowSessionRemaindersGutHealth } from "./campaigns/remainders/gutHealthSessionRemainders.js";
import { tommarowDay1SessionRemainders, tommarowWelcomeSessionRemainder } from "./campaigns/remainders/tommarowSessionRemainders.js";
import { fiveMinWelcomeSessionRemainderEvening, fiveMinWelcomeSessionRemainderMorning, liveNowRemainder } from "./campaigns/remainders/welcomeSessionRemainders.js";
import { fiveMinSessionRemainderMetabolHealth, fiveMinSessionRemainderMetabolHealthEvening, liveNowRemainderMetabolHealth, tommarowSessionRemaindersMetabolHealth } from "./campaigns/remainders/MetabolHealthSessionRemainders.js";
import { fiveMinSessionRemainder14Con, fiveMinSessionRemainder14ConEve, tommarowSessionRemainders14Con } from "./campaigns/remainders/14ConSessionRemainders.js";


export const triggerFiveRem = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-06-29')
    .eq("is_active", true)
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

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
    .eq("current_session_date", '2026-06-29')
    .eq("is_active", true)
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

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


export const triggerTommarowrem = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .eq("current_session_date", '2026-06-29')
    .eq("is_active", true)
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  let count = 0;
  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

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
    .eq("current_session_date", '2026-06-29')
    .eq("is_active", true)
    .order("id", { ascending: false });


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
    .eq("current_session_date", '2026-06-29')
    .eq("is_active", true)
    .order("id", { ascending: false });


  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  let count = 0;
  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

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
    .eq("current_session_date", '2026-06-29')
    .eq("is_active", true)
    .order("id", { ascending: false });


  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  let count = 0;
  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

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
    .gt("id", 5053)
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

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
    .gt("id", 5053)
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

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
