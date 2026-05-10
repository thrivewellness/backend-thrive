import { supabase } from "../../lib/supabase.js";
import { presentFunction } from "./campaigns/attendence/presentFunction.js";
import { absentFunction } from "./campaigns/attendence/absentFunction.js";
import { processPhone } from "../../utils/phoneUtils.js";
import { delay } from "../../utils/delay.js";


const YOGA_CAMPAIGN_JOIN_CUTOFF = "2026-04-19T23:59:59Z";
const YOGA_CAMPAIGN_JOIN_END_DATE = "2026-05-11T23:59:59Z";

// 🎯 Attendance Trigger Function
export const triggerAttendance = async (triggeredToday, dayNumber) => {
  console.log("> Running Attendance Function");
  console.log("> Triggered Campaign:", triggeredToday);
  console.log("> Day Number:", dayNumber);

  try {
    // 🔹 Fetch required fields from yoga_signups table
    const { data: users, error } = await supabase
      .from("yoga_signups")
      .select("*")
      .gt("created_at", YOGA_CAMPAIGN_JOIN_CUTOFF)
      .lte("created_at", YOGA_CAMPAIGN_JOIN_END_DATE)
      .order("created_at", { ascending: false })
      .range(0, 5000);


    if (error) {
      console.error("Supabase Fetch Error:", error);
      return;
    }

    for (const user of users) {
      const { id, name, country_code, phone, attendance } = user;

      // 📱 Convert to WhatsApp-ready number
      const whatsappPhone = `${country_code}${phone}`.replace(/\D/g, "");

      const isPresent = attendance?.includes(triggeredToday);


      try {
        if (isPresent) {
          await presentFunction(id, whatsappPhone, name, dayNumber);
         
        } else {
          await absentFunction(id, whatsappPhone, name, dayNumber);
          
        }
      } catch (err) {
        console.error(`> Failed for ${user.id}`, err.message);
      }



      await delay(1000);
    }

    console.log("> Attendance processing completed successfully");
  } catch (err) {
    console.error("Attendance Error:", err);
  }
};
