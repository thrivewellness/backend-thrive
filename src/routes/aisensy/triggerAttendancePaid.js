import { supabase } from "../../lib/supabase.js";
import { presentFunctionPaid } from "./campaigns/attendencepaid/presentFunctionPaid.js";
import { absentFunctionPaid } from "./campaigns/attendencepaid/absentFunctionPaid.js";
import { delay } from "../../utils/delay.js";
import { processPhone } from "../../utils/phoneUtils.js";

const PAID_ATTENDANCE_MILESTONES = new Set([
  50, 100, 200, 300, 500, 1000, 1500, 2000, 2500,
]);

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
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second}`;
};

const formatDate = (date) => date.toISOString().slice(0, 10);

const addDays = (dateString, days) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return formatDate(date);
};

const getTrackerDates = (today) =>
  Array.from({ length: 7 }, (_, index) => addDays(today, index - 6));

const getPlanDayNumber = (planStartDate, today) => {
  const start = new Date(`${String(planStartDate).slice(0, 10)}T12:00:00Z`);
  const current = new Date(`${today}T12:00:00Z`);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.floor((current - start) / millisecondsPerDay) + 1;
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
    .from("paid_users")
    .update({ activity: updatedActivity })
    .eq("id", user.id);

  if (error) throw error;
};

const hasAbsentMessageSent = (activityList, date) =>
  activityList.some(
    (item) => item?.type === "absent_message" && item?.date === date && item?.sent === true
  );

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
    .from("paid_users")
    .update({ activity: updatedActivity })
    .eq("id", user.id);

  if (error) throw error;
};

export const triggerAttendancePaid = async (
  triggeredToday = getTodayIST(),
  presentMessageTime = null,
  options = {}
) => {
  const { sendAbsent = presentMessageTime === null } = options;

  console.log("> Running Paid Attendance Function");
  console.log("> Triggered Date:", triggeredToday);
  console.log("> Present Message Time:", presentMessageTime || "all");
  console.log("> Send Absent:", sendAbsent);

  try {
    const { data: users, error } = await supabase
      .from("paid_users")
      .select("*")
      .eq("is_active", true)
      .lte("plan_start_date", triggeredToday)
      .gte("plan_end_date", triggeredToday)
      .order("id", { ascending: false });

    if (error) throw error;

    for (const user of users || []) {
      const attendanceList = Array.isArray(user.attendance) ? user.attendance : [];
      const activityList = Array.isArray(user.activity) ? user.activity : [];
      const isPresent = attendanceList.includes(triggeredToday);
      const shouldSendPresent = presentMessageTime
        ? hasPendingPresentActivity(activityList, triggeredToday, presentMessageTime)
        : isPresent;
      const shouldSendAbsent =
        sendAbsent && !isPresent && !hasAbsentMessageSent(activityList, triggeredToday);

      if (!shouldSendPresent && !shouldSendAbsent) continue;

      const { whatsappPhone } = processPhone(user.phone, user.country_code);
      const uniqueAttendance = [...new Set(attendanceList.filter(Boolean))];
      const totalPresentDays = uniqueAttendance.length;
      const tracker = getTrackerDates(triggeredToday)
        .map((date) => (attendanceList.includes(date) ? "\u2705" : "\u2B1C"))
        .join("");
      const planDayNumber = getPlanDayNumber(user.plan_start_date, triggeredToday);

      try {
        if (shouldSendPresent) {
          await presentFunctionPaid(
            user.id,
            whatsappPhone,
            user.name,
            planDayNumber,
            tracker,
            totalPresentDays,
            PAID_ATTENDANCE_MILESTONES.has(totalPresentDays)
          );
          if (presentMessageTime) {
            await markPresentActivitySent(user, triggeredToday, presentMessageTime);
          }
        } else {
          await absentFunctionPaid(user.id, whatsappPhone, user.name);
          await markAbsentMessageSent(user, triggeredToday);
        }
      } catch (err) {
        console.error(`> Paid attendance failed for ${user.id}`, err.message);
      }

      await delay(100);
    }

    console.log("> Paid attendance processing completed successfully");
  } catch (err) {
    console.error("> Paid Attendance Error:", err);
  }
};
