import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { sendThriveYogaPlansMessage } from "./campaigns/promtions/sendThriveYogaPlansMessage.js";


// 🎯 Plans Trigger Function
export const triggerPlans = async ( dayNumber) => {
  console.log("> Running Plans Function");
  console.log("> Day Number:", dayNumber);

  try {
    // 🔹 Fetch required fields from yoga_signups table
    const { data: users, error } = await supabase
      .from("yoga_signups")
      .select("*")
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

     const isPresent = Array.isArray(attendance) && attendance.length > 0;


      try {
        if (isPresent) {
          await sendThriveYogaPlansMessage(id, whatsappPhone, name, dayNumber);
        } else {
          console.log(`> User ${id} is absent. Skipping.`);
          continue;
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