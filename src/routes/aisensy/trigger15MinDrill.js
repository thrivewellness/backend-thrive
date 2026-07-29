import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { processPhone } from "../../utils/phoneUtils.js";
import { send15MinDrill } from "./campaigns/intractions/send15MinDrill.js";


// Plans Trigger Function
export const trigger15MinDrill = async () => {
  console.log("> Running Plans Function");

const now = new Date();

// Round to the top of the current hour
now.setMinutes(0, 0, 0);

// Window:
// start = 90 minutes ago
// end   = 30 minutes ago
const start = new Date(now.getTime() - 90 * 60 * 1000);
const end = new Date(now.getTime() - 30 * 60 * 1000);


console.log("now:",now)
console.log("strat:",start)
console.log("end", end)

const { data: users, error } = await supabase
  .from("yoga_signups")
  .select("id, name, country_code, phone, current_session_date, created_at")
  .gte("created_at", start.toISOString())
  .lt("created_at", end.toISOString())
  .order("created_at", { ascending: true });

  if (error) {
    console.error("> Error fetching recent yoga signups:", error);
    return;
  }

  if (!users?.length) {
    console.log("> No users found from the last 1 hour");
    return;
  }

  for (const user of users) {
    const phoneData = processPhone(user.phone, user.country_code);
    const { localPhone, whatsappPhone } = phoneData;

    try {
      await send15MinDrill({
        whatsappPhone,
        name: user.name,
        startDate: user.current_session_date,
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
