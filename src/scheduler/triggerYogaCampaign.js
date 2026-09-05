import { supabase } from "../lib/supabase.js";
import { day0SessionMorning, day0SessionEvening } from "../routes/aisensy/campaigns/day0welcome.js"
import { GutHealthDay6, GutHealthDay6Evening } from "../routes/aisensy/campaigns/day6Session.js"
import { delay } from "../utils/delay.js";
import { morningSessions, eveningSessions } from "./utils/paramToFuntionMatching.js";
import dayjs from "dayjs";
import { continue14Session, continue14SessionEvening } from "../routes/aisensy/campaigns/continue14Session.js";
import { processPhone } from "../utils/phoneUtils.js";
import { PaidUsersMsgEvening, PaidUsersMsgMorning } from "../routes/aisensy/campaigns/paidusers/PaidUsersMsg.js";

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
    await delay(50);
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
    .eq("current_session_date", '2026-08-24')
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

    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await sessionFunction({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
      });


    } catch (err) {
      console.error(`> Failed for ${user.id}`, err.message);
    }

    await delay(50);
  }

  console.log("> Yoga campaign finished");
};

export const triggerGutHealthProgram = async (dayNumber) => {
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
    await delay(10);
  }

  console.log("> Yoga campaign finished");
};


export const triggerwelcomeevening = async (dayNumber) => {
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

  let count = 0;

  for (const user of users) {
    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

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

    count++;
    await delay(10);
  }

  console.log(`> Yoga campaign finished. Total users processed: ${count}`);
};


export const triggerYogaCampaignmorningnew = async (dayNumber) => {
  console.log("> Yoga new campaign started");
  console.log("> day number: ", dayNumber);

  const sessionFunction = morningSessions[dayNumber];

  if (!sessionFunction) {
    console.log("> Invalid day number");
    return;
  }

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
    await delay(50);
  }

  console.log("> Yoga campaign finished");
};


export const triggerYogaCampaigneveningnew = async (dayNumber) => {
  console.log("> Yoga campaign new started");
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
    .eq("current_session_date", '2026-08-31')
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

    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await sessionFunction({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
      });


    } catch (err) {
      console.error(`> Failed for ${user.id}`, err.message);
    }

    await delay(50);
  }

  console.log("> Yoga campaign finished");
};

export const triggerPaidUserMsgMorning = async (dayNumber) => {
  console.log("> Paid Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("paid_users")
    .select("name, country_code, phone, ref_user_id")
    .order("id", { ascending: false });

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await PaidUsersMsgMorning({
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
    await delay(50);
  }

  console.log("> Yoga campaign finished");
};


export const triggerPaidUserMsgEvening = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);
  const todayDate = dayjs().format("YYYY-MM-DD");

  console.log("Today's date:", todayDate);

  const { data: users } = await supabase
    .from("paid_users")
    .select("name, country_code, phone, attendance, ref_user_id")
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

    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await PaidUsersMsgEvening({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
        dayNumber
      });

    } catch (err) {
      console.error(`> Failed for ${user.id}`, err.message);
    }

    await delay(50);
  }

  console.log("> Yoga campaign finished");
};