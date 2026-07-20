import { supabase } from "../../lib/supabase.js";
import { presentFunction } from "./campaigns/attendence/presentFunction.js";
import { absentFunction } from "./campaigns/attendence/absentFunction.js";
import { delay } from "../../utils/delay.js";
import { processPhone } from "../../utils/phoneUtils.js";

const formatDate = (date) => date.toISOString().slice(0, 10);

const getTodayIST = () =>
  new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

const getNowIST = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const dateParts = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );

  return `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}:${dateParts.minute}:${dateParts.second}`;
};

const addDays = (dateString, days) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return formatDate(date);
};

const getDatePart = (dateString) => dateString?.toString().slice(0, 10);

const getDateAtUTCNoon = (dateString) => {
  const [year, month, day] = getDatePart(dateString).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
};

const calculateDayNumber = (currentSessionDate, todayDate) => {
  if (!currentSessionDate || !todayDate) {
    return null;
  }

  const sessionStart = getDateAtUTCNoon(currentSessionDate);
  const today = getDateAtUTCNoon(todayDate);

  if (Number.isNaN(sessionStart.getTime()) || Number.isNaN(today.getTime())) {
    return null;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((today - sessionStart) / millisecondsPerDay) + 1;
};

const getAttendanceDayNumbersForDate = (dateString) => {
  const day = getDateAtUTCNoon(dateString).getUTCDay();
  const weekPosition = day === 0 ? 7 : day;

  return [weekPosition, weekPosition + 7];
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

const getTotalPresentDays = (attendanceList) => {
  return new Set(attendanceList.filter(Boolean)).size;
};

const hasPendingPresentActivity = (activityList, date, presentMessageTime) => {
  const times = Array.isArray(presentMessageTime) ? presentMessageTime : [presentMessageTime];
  return activityList.some(
    (item) =>
      item?.type === "attendance" &&
      item?.date === date &&
      times.includes(item?.present_message_time) &&
      item?.present_message_sent !== true
  );
};

const markPresentActivitySent = async (user, date, presentMessageTime) => {
  const times = Array.isArray(presentMessageTime) ? presentMessageTime : [presentMessageTime];
  const nowIST = getNowIST();
  const activityList = Array.isArray(user.activity) ? user.activity : [];
  const updatedActivity = activityList.map((item) => {
    if (
      item?.type === "attendance" &&
      item?.date === date &&
      times.includes(item?.present_message_time) &&
      item?.present_message_sent !== true
    ) {
      return {
        ...item,
        present_message_sent: true,
        present_message_sent_at: nowIST,
      };
    }

    return item;
  });

  const { error } = await supabase
    .from("yoga_signups")
    .update({ activity: updatedActivity })
    .eq("id", user.id);

  if (error) throw error;
};

const hasAbsentMessageSent = (activityList, date) =>
  activityList.some((item) => item?.type === "absent_message" && item?.date === date && item?.sent === true);

const markAbsentMessageSent = async (user, date) => {
  const nowIST = getNowIST();
  const activityList = Array.isArray(user.activity) ? user.activity : [];
  const updatedActivity = [
    ...activityList,
    {
      date,
      time: nowIST,
      type: "absent_message",
      sent: true,
      sent_at: nowIST,
    },
  ];

  const { error } = await supabase
    .from("yoga_signups")
    .update({ activity: updatedActivity })
    .eq("id", user.id);

  if (error) throw error;
};

// Attendance Trigger Function
export const triggerAttendance = async (
  triggeredToday,
  dayNumber,
  presentMessageTime = null,
  options = {}
) => {
  if (!dayNumber) {
    dayNumber = triggeredToday;
    triggeredToday = getTodayIST();
  }

  const { sendAbsent = presentMessageTime === null } = options;

  console.log("> Running Attendance Function");
  console.log("> Triggered Campaign:", triggeredToday);
  console.log("> Present Message Time:", presentMessageTime || "all");
  console.log("> Send Absent:", sendAbsent);

  try {
    const targetDayNumbers = getAttendanceDayNumbersForDate(triggeredToday);
    const targetSessionDates = targetDayNumbers.map((targetDayNumber) =>
      addDays(triggeredToday, -(targetDayNumber - 1))
    );

    console.log("> Target Day Numbers:", targetDayNumbers.join(", "));
    console.log("> Target Session Dates:", targetSessionDates.join(", "));

    const { data: users, error } = await supabase
      .from("yoga_signups")
      .select("*")
      .in("current_session_date", targetSessionDates)
      .eq("is_active", true)
      .order("id", { ascending: false });

    if (error) {
      console.error("Supabase Fetch Error:", error);
      return;
    }

    for (const user of users) {
      const { id, name, country_code, phone, attendance, activity, ref_user_id } = user;
      const userDayNumber = calculateDayNumber(user.current_session_date, triggeredToday);

      if (!targetDayNumbers.includes(userDayNumber)) {
        continue;
      }

      const { trackerDates, consecutiveAbsentDates, badgeDates } = getAttendanceContext(userDayNumber, triggeredToday);
      const phoneData = processPhone(phone, country_code);
      const { localPhone, whatsappPhone } = phoneData;
      const attendanceList = Array.isArray(attendance) ? attendance : [];
      const activityList = Array.isArray(activity) ? activity : [];
      const isPresent = attendanceList.includes(triggeredToday);
      const shouldSendPresent = presentMessageTime
        ? hasPendingPresentActivity(activityList, triggeredToday, presentMessageTime)
        : isPresent;
      const shouldSendAbsent =
        sendAbsent && !isPresent && !hasAbsentMessageSent(activityList, triggeredToday);

      const tracker = trackerDates
        .map((date) => (attendanceList.includes(date) ? "\u2705" : "\u2B1C"))
        .join("");

      const totalPresentDays = getTotalPresentDays(attendanceList);
      const consecutiveAbsentCount = isPresent ? 0 : getConsecutiveAbsentCount(consecutiveAbsentDates, attendanceList);
      const isBadgeEligible = hasFullAttendance(badgeDates, attendanceList);

      try {
        if (shouldSendPresent) {
          await presentFunction(id, whatsappPhone, name, userDayNumber, tracker, totalPresentDays, isBadgeEligible, ref_user_id);
          if (presentMessageTime) {
            await markPresentActivitySent(user, triggeredToday, presentMessageTime);
          }
        } else if (shouldSendAbsent) {
          await absentFunction(id, whatsappPhone, name, userDayNumber, consecutiveAbsentCount, ref_user_id);
          await markAbsentMessageSent(user, triggeredToday);
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
