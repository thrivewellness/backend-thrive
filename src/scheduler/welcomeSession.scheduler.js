import cron from "node-cron";
import { supabase } from "../lib/supabase.js";
import {
  triggerYogaCampaignManually,
  triggerYogaCampaignevening,
  triggerGutHealthProgram
} from "./triggerYogaCampaign.js";

const CAMPAIGNS = [
  {
    name: "yoga_jan_31_morning",
    targetTime: new Date("2026-01-31T05:05:00"), 
    handler: triggerYogaCampaignManually,
  },
  {
    name: "yoga_jan_31_evening",
    targetTime: new Date("2026-01-31T16:00:00"), 
    handler: triggerYogaCampaignevening,
  },
    {
    name: "gut_prog_jan_31",
    targetTime: new Date("2026-01-31T10:30:00"),
    handler: triggerGutHealthProgram,
  },
];

cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log("> Server time:", now.toString());

  for (const campaign of CAMPAIGNS) {
    if (now < campaign.targetTime) continue;

    // ATOMIC LOCK
    const { data: updated, error } = await supabase
      .from("campaigns")
      .update({ triggered: true })
      .eq("name", campaign.name)
      .eq("triggered", false)
      .select();

    // Already triggered or lock failed
    if (!updated || updated.length === 0) continue;

    console.log(`> Lock acquired for ${campaign.name}`);
    await campaign.handler();
  }
});
