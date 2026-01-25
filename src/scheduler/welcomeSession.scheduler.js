import cron from "node-cron";
import { supabase } from "../lib/supabase.js";
import { triggerYogaCampaignManually } from "./triggerYogaCampaign.js";

const CAMPAIGN_NAME = "welcome_yoga_jan_25_evn";
const TARGET_TIME = new Date("2026-01-25T17:48:00"); // IST



cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log("> Server time:", now.toString());

  if (now < TARGET_TIME) return;

  // ATOMIC LOCK
  const { data: updated, error } = await supabase
    .from("campaigns")
    .update({ triggered: true })
    .eq("name", CAMPAIGN_NAME)
    .eq("triggered", false)
    .select();

  // If no row updated → already triggered by another process
  if (!updated || updated.length === 0) {
    return;
  }

  console.log("> Lock acquired. Triggering campaign...");
  await triggerYogaCampaignManually();
});
