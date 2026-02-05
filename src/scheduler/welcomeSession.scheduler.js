import cron from "node-cron";
import { supabase } from "../lib/supabase.js";
import {
  triggerYogaCampaignManually,
  triggerYogaCampaignevening,
  triggerGutHealthProgram
} from "./triggerYogaCampaign.js";

const CAMPAIGNS = [
  {
    name: "yoga_fab_6_morning",
    targetTime: new Date("2026-02-06T05:05:00"), 
    handler: triggerYogaCampaignManually,
  },
  {
    name: "yoga_fab_6_eve",
    targetTime: new Date("2026-02-06T16:00:00"), 
    handler: triggerYogaCampaignevening,
  },
    {
    name: "gut_prog_feb_1",
    targetTime: new Date("2026-02-01T10:30:00"),
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
