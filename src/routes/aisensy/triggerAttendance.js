import { supabase } from "../../lib/supabase.js";
import { presentFunction } from "./campaigns/attendence/presentFunction.js";
import { absentFunction } from "./campaigns/attendence/absentFunction.js";
import { delay } from "../../utils/delay.js";

const formatDate = (date) => date.toISOString().slice(0, 10);

const addDays = (dateString, days) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return formatDate(date);
};

const getDatesEndingOn = (endDate, totalDays) => {
  return Array.from({ length: totalDays }, (_, index) => addDays(endDate, index - totalDays + 1));
};

const getAttendanceContext = (dayNumber, triggeredToday) => {
  const day = Number(dayNumber);
  const weekPosition = ((day - 1) % 7) + 1;
  const trackerDates = getDatesEndingOn(triggeredToday, weekPosition);
  const consecutiveAbsentDates = getDatesEndingOn(triggeredToday, Math.min(day, 3));
  const badgeDates = [3, 7, 14].includes(day) ? getDatesEndingOn(triggeredToday, day) : [];

  return { trackerDates, consecutiveAbsentDates, badgeDates };
};

const getConsecutiveAbsentCount = (dates, attendanceList) => {
  let count = 0;

  for (const date of [...dates].reverse()) {
    if (attendanceList.includes(date)) {
      break;
    }

    count += 1;
  }

  return count;
};

const hasFullAttendance = (dates, attendanceList) => {
  return dates.length > 0 && dates.every((date) => attendanceList.includes(date));
};

// Attendance Trigger Function
export const triggerAttendance = async (triggeredToday, dayNumber) => {
  console.log("> Running Attendance Function");
  console.log("> Triggered Campaign:", triggeredToday);
  console.log("> Day Number:", dayNumber);

  try {
    const { trackerDates, consecutiveAbsentDates, badgeDates } = getAttendanceContext(dayNumber, triggeredToday);

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

    for (const user of users) {
      const { id, name, country_code, phone, attendance, ref_user_id } = user;
      const whatsappPhone = `${country_code}${phone}`.replace(/\D/g, "");
      const attendanceList = Array.isArray(attendance) ? attendance : [];
      const isPresent = attendanceList.includes(triggeredToday);

      const tracker = trackerDates
        .map((date) => (attendanceList.includes(date) ? "\u2705" : "\u2B1C"))
        .join("");

      const consecutiveAbsentCount = isPresent ? 0 : getConsecutiveAbsentCount(consecutiveAbsentDates, attendanceList);
      const isBadgeEligible = hasFullAttendance(badgeDates, attendanceList);

      try {
        if (isPresent) {
          await presentFunction(id, whatsappPhone, name, dayNumber, tracker, isBadgeEligible, ref_user_id);
        } else {
          await absentFunction(id, whatsappPhone, name, dayNumber, consecutiveAbsentCount, ref_user_id);
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
