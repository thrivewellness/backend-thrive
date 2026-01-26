import { supabase } from "../lib/supabase.js";
import { sendWelcomeSessionMorningMessage } from "../routes/aisensy/campaigns/welcomeSession.js";
import { delay } from "../utils/delay.js";

export const triggerYogaCampaignManually = async () => {
  console.log("> Yoga campaign started");

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await sendWelcomeSessionMorningMessage({
        whatsappPhone,
        name: user.name,
        userId: user.ref_user_id,
      });

      console.log(`> Sent to ${user.id}`);
    } catch (err) {
      console.error(`> Failed for ${user.id}`, err.message);
    }

    // WhatsApp safety delay
    await delay(7000);
  }

  console.log("> Yoga campaign finished");
};
