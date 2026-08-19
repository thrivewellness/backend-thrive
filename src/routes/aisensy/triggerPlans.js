import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { sendThriveYogaPlansMessage } from "./campaigns/promtions/sendThriveYogaPlansMessage.js";
import { sendThriveYogaPlans1day } from "./campaigns/promtions/sendThriveYogaPlans1day.js";
import { sendVideoMessage15day } from "./campaigns/promtions/sendVideoMessage15day.js";
import { sendChineseMsg } from "./campaigns/promtions/sendChineseMsg.js";
import { sendThriveYogaPlans2day } from "./campaigns/promtions/sendThriveYogaPlans2day.js";
import { sendThriveconsultaion3day } from "./campaigns/promtions/sendThriveconsultaion3day.js";
import { sendPlansOfferMsg } from "./campaigns/promtions/sendPlansOfferMsg.js";
import { processPhone } from "../../utils/phoneUtils.js";

// Plans Trigger Function
export const triggerPlans = async (dayNumber) => {
  console.log("> Running Plans Function");
  try {
    // Fetch users from yoga_signups
    const { data: users, error } = await supabase
      .from("yoga_signups")
      .select("*")
      .eq("current_session_date", "2026-08-10")
      .order("id", { ascending: false });

    if (error) {
      console.error("Supabase Fetch Error:", error);
      return;
    }

    // Fetch all paid users
    const { data: paidUsers, error: paidError } = await supabase
      .from("paid_users")
      .select("country_code, phone");

    if (paidError) {
      console.error("Paid Users Fetch Error:", paidError);
      return;
    }

    // Create a lookup set of paid WhatsApp numbers
    const paidNumbers = new Set(
      paidUsers.map((user) => {
        const { whatsappPhone } = processPhone(
          user.phone,
          user.country_code
        );
        return whatsappPhone;
      })
    );

    let sentCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      const { id, name } = user;

      const { whatsappPhone } = processPhone(
        user.phone,
        user.country_code
      );

      // Skip users who have already purchased a plan
      if (paidNumbers.has(whatsappPhone)) {
        skippedCount++;
        console.log(`> Skipping paid user: ${id} (${whatsappPhone})`);
        continue;
      }

      try {
        await sendThriveconsultaion3day(id, whatsappPhone, name, dayNumber);
        sentCount++;
      } catch (err) {
        console.error(`> Failed for user ${id}:`, err.message);
      }

      await delay(300);
    }

    console.log(`> Total Sent: ${sentCount}`);
    console.log(`> Total Skipped (Paid Users): ${skippedCount}`);
  } catch (err) {
    console.error("Trigger Plans Error:", err);
  }
};