import { supabase } from "../lib/supabase.js";
import { sendWelcomeSessionMorningMessage } from "../routes/aisensy/campaigns/welcomeSession.js";
import { day0SessionMorning, day0SessionEvening } from "../routes/aisensy/campaigns/day0welcome.js"
import { day1Session, day1SessionEvening } from "../routes/aisensy/campaigns/day1Session.js"
import { day2Session, day2SessionEvening } from "../routes/aisensy/campaigns/day2Session.js"
import { day3Session, day3SessionEvening } from "../routes/aisensy/campaigns/day3Session.js"
import { day4Session, day4SessionEvening } from "../routes/aisensy/campaigns/day4Session.js"
import { day5Session, day5SessionEvening } from "../routes/aisensy/campaigns/day5Session.js"
import { day6Session, day6SessionEvening, GutHealthDay6, GutHealthDay6Evening } from "../routes/aisensy/campaigns/day6Session.js"
import { day7Session, day7SessionEvening } from "../routes/aisensy/campaigns/day7Session.js"
import { day8Session, day8SessionEvening } from "../routes/aisensy/campaigns/day8Session.js"
import { day9Session, day9SessionEvening } from "../routes/aisensy/campaigns/day9Session.js"
import { day10Session, day10SessionEvening } from "../routes/aisensy/campaigns/day10Session.js"
import { day11Session, day11SessionEvening } from "../routes/aisensy/campaigns/day11Session.js"
import { day12Session, day12SessionEvening } from "../routes/aisensy/campaigns/day12Session.js"
import { day13Session, day13SessionEvening } from "../routes/aisensy/campaigns/day13Session.js"
import { day14Session, day14SessionEvening } from "../routes/aisensy/campaigns/day14Session.js"
import { GutHealthProgram } from "../routes/aisensy/campaigns/gutHealth.js"
import { delay } from "../utils/delay.js";
import { morningSessions, eveningSessions } from "./utils/paramToFuntionMatching.js";
import dayjs from "dayjs";
import { continue14Session, continue14SessionEvening } from "../routes/aisensy/campaigns/continue14Session.js";

export const triggerYogaCampaignmorning = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const sessionFunction = morningSessions[dayNumber];

  if (!sessionFunction) {
    console.log("> Invalid day number");
    return;
  }

  const { data: users } = await supabase
    .from("yoga_signups")
      .select("*")
      .eq("current_session_date", '2026-06-01')
      .eq("is_active", true)
      .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await sessionFunction({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
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


export const triggerYogaCampaignevening = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);
  const todayDate = dayjs().format("YYYY-MM-DD");

  console.log("Today's date:", todayDate);  

  const sessionFunction = eveningSessions[dayNumber];

  if (!sessionFunction) {
    console.log("> Invalid day number");
    return;
  }

  const { data: users } = await supabase
  .from("yoga_signups")
      .select("*")
      .eq("current_session_date", '2026-06-01')
      .eq("is_active", true)
      .order("id", { ascending: false });


  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const hasTodayAttendance =
      Array.isArray(user.attendance) && user.attendance.includes(todayDate);

    if (hasTodayAttendance) {
      console.log(`> Skipped ${user.id} (attendance already marked for ${todayDate})`);
      continue;
    }

    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await sessionFunction({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
      });

    
    } catch (err) {
      console.error(`> Failed for ${user.id}`, err.message);
    }

    await delay(200);
  }

  console.log("> Yoga campaign finished");
};

export const triggerGutHealthProgram = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
      .select("*")
      .eq("current_session_date", '2026-06-01')
      .eq("is_active", true)
      .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await GutHealthDay6({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
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


export const triggerGutHealthProgramEvening = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
      .select("*")
      .eq("current_session_date", '2026-06-01')
      .eq("is_active", true)
      .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await GutHealthDay6Evening({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
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


export const triggerwelcomenmorning = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
      .select("*")
      .eq("current_session_date", '2026-06-01')
      .eq("is_active", true)
      .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await day0SessionMorning({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
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


export const triggerwelcomeevening = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
      .select("*")
      .eq("current_session_date", '2026-06-01')
      .eq("is_active", true)
      .order("id", { ascending: false });


  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await day0SessionEvening({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
      });

      console.log(`> Sent to ${user.id}`);
    } catch (err) {
      console.error(`> Failed for ${user.id}`, err.message);
    }

    await delay(200);
  }

  console.log("> Yoga campaign finished");
};


export const trigger14ComProgram = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
      .select("*")
      .eq("current_session_date", '2026-06-01')
      .eq("is_active", true)
      .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await continue14Session({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
      });

      console.log(`> Sent to ${user.id}`);
    } catch (err) {
      console.error(`> Failed for ${user.id}`, err.message);
    }

    // WhatsApp safety delay
    await delay(40);
  }

  console.log("> Yoga campaign finished");
};


export const trigger14ComProgramEvening = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
      .select("*")
      .eq("current_session_date", '2026-06-01')
      .eq("is_active", true)
      .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await continue14SessionEvening({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
      });

      console.log(`> Sent to ${user.id}`);
    } catch (err) {
      console.error(`> Failed for ${user.id}`, err.message);
    }

    // WhatsApp safety delay
    await delay(40);
  }

  console.log("> Yoga campaign finished");
};

