import cron from "node-cron";
import { supabase } from "../lib/supabase.js";
import {
  triggerYogaCampaignmorning,
  triggerYogaCampaignevening,
  triggerGutHealthProgram
} from "./triggerYogaCampaign.js";

const HANDLERS = {
  triggerYogaCampaignmorning,
  triggerYogaCampaignevening,
  triggerGutHealthProgram,
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