import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { sendThriveYogaPlansMessage } from "./campaigns/promtions/sendThriveYogaPlansMessage.js";
import { sendThriveYogaPlans1day } from "./campaigns/promtions/sendThriveYogaPlans1day.js";
import { sendVideoMessage15day } from "./campaigns/promtions/sendVideoMessage15day.js";
import { sendChineseMsg } from "./campaigns/promtions/sendChineseMsg.js";
import { sendThriveYogaPlans2day } from "./campaigns/promtions/sendThriveYogaPlans2day.js";
import { sendThriveconsultaion3day } from "./campaigns/promtions/sendThriveconsultaion3day.js";


// Plans Trigger Function
export const triggerPlans = async (dayNumber) => {
  console.log("> Running Plans Function");

  try {
    // 🔹 Fetch required fields from yoga_signups table
    const { data: users, error } = await supabase
      .from("yoga_signups")
      .select("*")
      .eq("current_session_date", '2026-06-15')
      .eq("is_active", true)
      .order("id", { ascending: false });



    if (error) {
      console.error("Supabase Fetch Error:", error);
      return;
    }

    let presentCount = 0;

    for (const user of users) {
      const { id, name, country_code, phone, attendance } = user;

      // Convert to WhatsApp-ready number
      const whatsappPhone = `${country_code}${phone}`.replace(/\D/g, "");

      const isPresent = Array.isArray(attendance) && attendance.length > 1;


      try {
        if (isPresent) {
          presentCount++;
          await sendVideoMessage15day(id, whatsappPhone, name, dayNumber);
        } else {
          //console.log(`> User ${id} Skipping.`);
          continue;
        }
      } catch (err) {
        console.error(`> Failed for ${user.id}`, err.message);
      }
      await delay(1000);
    }

    console.log(`> Total Sent: ${presentCount}`);
  } catch (err) {
    console.error("Attendance Error:", err);
  }
};