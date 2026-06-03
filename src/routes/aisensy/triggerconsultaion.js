import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { sendThriveconsultaion3day } from "./campaigns/promtions/sendThriveconsultaion3day.js";



const YOGA_CAMPAIGN_JOIN_CUTOFF = "2026-02-28T23:59:59Z";
const YOGA_CAMPAIGN_JOIN_END_DATE = "2026-03-29T23:59:59Z";

// 🎯 Plans Trigger Function
export const triggerconsultaion = async ( dayNumber) => {
  console.log("> Running consultaion Function");

  try {
    // 🔹 Fetch required fields from yoga_signups table
    const { data: users, error } = await supabase
      .from("yoga_signups")
      .select("*")
      .eq("current_session_date", '2026-06-01')
      .eq("is_active", true)
      .order("id", { ascending: false });


    if (error) {
      console.error("Supabase Fetch Error:", error);
      return;
    }

    let presentCount = 0;

    for (const user of users) {
      const { id, name, country_code, phone, attendance } = user;

      // 📱 Convert to WhatsApp-ready number
      const whatsappPhone = `${country_code}${phone}`.replace(/\D/g, "");

     const isPresent = Array.isArray(attendance) && attendance.length > 1;


      try {
        if (isPresent) {
          presentCount++;
          await sendThriveconsultaion3day(id, whatsappPhone, name, dayNumber);
        } else {
          //console.log(`> User ${id} is absent. Skipping.`);
          continue;
        }
      } catch (err) {
        console.error(`> Failed for ${user.id}`, err.message);
      }

      await delay(500);
    }

    console.log(`> Attendance processing completed successfully. Total present users: ${presentCount}`);
  } catch (err) {
    console.error("Attendance Error:", err);
  }
};