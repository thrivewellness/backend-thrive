import cron from "node-cron";
import { supabase } from "../lib/supabase.js";
import {
  triggerYogaCampaignmorning,
  triggerYogaCampaignevening,
  triggerGutHealthProgram,
  triggerGutHealthProgramEvening,
  triggerwelcomenmorning,
  triggerwelcomeevening,
  trigger14ComProgram,
  trigger14ComProgramEvening,
  triggerYogaCampaignmorningnew,
  triggerYogaCampaigneveningnew
} from "./triggerYogaCampaign.js";
import { triggerAttendance } from "../routes/aisensy/triggerAttendance.js";
import { triggerPlans } from "../routes/aisensy/triggerPlans.js";
import { triggerconsultaion } from "../routes/aisensy/triggerconsultaion.js";
import { triggerFiveRem, triggerFiveRemEve, triggerLiveNowRem, triggerTommarowrem, triggerTommarowremmetabolic, triggerTommarowrem14con, triggerFiveRemWelEve, triggerFiveRemWel } from "../routes/aisensy/triggerRemainders.js";
import { triggerInstTestimonails, triggerYtVid } from "../routes/aisensy/triggertestimonails.js";
import { triggerJoinComunity } from "../routes/aisensy/triggerJoinComunity.js"; 

const HANDLERS = {
  triggerYogaCampaignmorning,
  triggerYogaCampaignevening,
  triggerGutHealthProgram,
  triggerAttendance,
  triggerPlans,
  triggerGutHealthProgramEvening,
  triggerconsultaion,
  triggerwelcomenmorning,
  triggerwelcomeevening,
  triggerFiveRem,
  triggerLiveNowRem,
  triggerTommarowrem,
  triggerFiveRemEve,
  triggerInstTestimonails,
  triggerTommarowrem14con,
  triggerTommarowremmetabolic,
  trigger14ComProgram,
  trigger14ComProgramEvening,
  triggerFiveRemWelEve,
  triggerFiveRemWel,
  triggerYtVid,
  triggerJoinComunity,
  triggerYogaCampaignmorningnew,
  triggerYogaCampaigneveningnew
};

cron.schedule("* * * * *", async () => {
  const now = new Date().toISOString(); // Always use ISO
  console.log("> Server time:", now);

  // 1️⃣ Get campaigns ready to trigger
  const { data: campaigns, error } = await supabase
    .from("campaigns_data")
    .select("*")
    .lte("trigger_time", now)
    .eq("triggered_status", false);

  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  if (!campaigns || campaigns.length === 0) return;



  for (const campaign of campaigns) {

    // 2️⃣ Atomic Lock (Prevents double execution)
    const { data: updated } = await supabase
      .from("campaigns_data")
      .update({ triggered_status: true })
      .eq("id", campaign.id)
      .eq("triggered_status", false)
      .select();

    if (!updated || updated.length === 0) continue;

    console.log(`> Triggering ${campaign.name}`);

    // 3️⃣ Call correct handler dynamically
    const handler = HANDLERS[campaign.funtion_name];

    if (handler) {
      await handler(campaign.day_number);
    } else {
      console.warn(`No handler found for ${campaign.funtion_name}`);
    }
  }
});

const triggerAttendanceSlot = async (presentMessageTime, sendAbsent = false) => {
  console.log(`> Checking campaigns for attendance slot ${presentMessageTime}...`);

  const campaign = await checkCampaignTriggeredToday(supabase);

  if (campaign) {
    console.log("> Campaign was triggered today.");
    await triggerAttendance(campaign.campaign_date, campaign.day_number, presentMessageTime, { sendAbsent });
  } else {
    console.log("> No campaign triggered today. Skipping.");
  }
};

cron.schedule("0 10 * * *", () => triggerAttendanceSlot(["08:00", "09:00", "10:00"]), {
  timezone: "Asia/Kolkata",
});

cron.schedule("45 11 * * *", () => triggerAttendanceSlot("11:45"), {
  timezone: "Asia/Kolkata",
});

cron.schedule("45 16 * * *", () => triggerAttendanceSlot("16:45"), {
  timezone: "Asia/Kolkata",
});

cron.schedule("35 20 * * *", () => triggerAttendanceSlot(["18:30", "19:30", "20:35"], true), {
  timezone: "Asia/Kolkata",
});


// Helper to check if any campaign was triggered today  
export const checkCampaignTriggeredToday = async (supabase) => {
  // Get today's date in IST (YYYY-MM-DD format)
  const todayIST = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
  // en-CA gives format: YYYY-MM-DD 

  const { data, error } = await supabase
    .from("campaigns_data")
    .select("id, campaign_date, day_number")
    .eq("campaign_date", todayIST)
    .eq("triggered_status", true)
    .limit(1)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error checking today's campaigns:", error);
    }
    return null;
  }

  return data;
};