import { supabase } from "../../lib/supabase.js";
import { presentFunction } from "./campaigns/attendence/presentFunction.js";
import { absentFunction } from "./campaigns/attendence/absentFunction.js";
import { delay } from "../../utils/delay.js";

const getRequiredDates = async (dayNumber, fallbackDate) => {
  const day = Number(dayNumber);
  const targetDays = [day - 2, day - 1, day].filter((d) => d > 0);

  const { data, error } = await supabase
    .from("campaigns_data")
    .select("day_number, campaign_date")
    .in("day_number", targetDays);

  if (error || !data?.length) {
    return [fallbackDate];
  }

  const dateByDay = new Map(data.map((row) => [Number(row.day_number), row.campaign_date]));
  const requiredDates = targetDays.map((d) => dateByDay.get(d)).filter(Boolean);

  return requiredDates.length ? requiredDates : [fallbackDate];
};

// Attendance Trigger Function
export const triggerAttendance = async (triggeredToday, dayNumber) => {
  console.log("> Running Attendance Function");
  console.log("> Triggered Campaign:", triggeredToday);
  console.log("> Day Number:", dayNumber);

  try {
    const requiredDates = await getRequiredDates(dayNumber, triggeredToday);

    const { data: users, error } = await supabase
      .from("yoga_signups")
      .select("*")
      .eq("is_active", true)
      .order("id", { ascending: false });

    if (error) {
      console.error("Supabase Fetch Error:", error);
      return;
    }

    for (const user of users) {
      const { id, name, country_code, phone, attendance } = user;
      const whatsappPhone = `${country_code}${phone}`.replace(/\D/g, "");
      const attendanceList = Array.isArray(attendance) ? attendance : [];
      const isPresent = attendanceList.includes(triggeredToday);

      const isConsecutive3DaysAbsent =
        requiredDates.length === 3 && requiredDates.every((date) => !attendanceList.includes(date));

      try {
        if (isPresent) {
          await presentFunction(id, whatsappPhone, name, dayNumber);
        } else {
          await absentFunction(id, whatsappPhone, name, dayNumber, isConsecutive3DaysAbsent);
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
