import express from "express";
import {supabase} from "../../../lib/supabase.js";

const router = express.Router();

const getISTDateTime = () => {
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
  const todayDate = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  const currentTime = `${dateParts.hour}:${dateParts.minute}`;
  const currentDateTime = `${todayDate} ${currentTime}:${dateParts.second}`;

  return { currentTime, todayDate, currentDateTime };
};

const calculateDayNumber = (currentSessionDate, todayDate) => {
  if (!currentSessionDate) {
    return null;
  }

  const sessionDate = currentSessionDate.toString().slice(0, 10);
  const parsedSessionDate = new Date(`${sessionDate}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(sessionDate) ||
      Number.isNaN(parsedSessionDate.getTime()) ||
      parsedSessionDate.toISOString().slice(0, 10) !== sessionDate) return null;
  const sessionStart = new Date(`${sessionDate}T00:00:00+05:30`);
  const today = new Date(`${todayDate}T00:00:00+05:30`);

  if (Number.isNaN(sessionStart.getTime()) || Number.isNaN(today.getTime())) {
    return null;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((today - sessionStart) / millisecondsPerDay) + 1;
};

const EVENING_ATTENDANCE_SLOTS = [
  { start: "17:15", end: "18:20", presentMessageTime: "18:30" },
  { start: "18:20", end: "19:20", presentMessageTime: "19:30" },
  { start: "19:20", end: "20:30", presentMessageTime: "20:35" },
];

const SPECIAL_EVENING_ATTENDANCE_SLOTS = [
  { start: "16:00", end: "16:40", presentMessageTime: "16:45" },
];

const getAttendanceSlot = (currentTime, dayNumber) => {
  const slots = [7, 14].includes(Number(dayNumber))
    ? SPECIAL_EVENING_ATTENDANCE_SLOTS
    : EVENING_ATTENDANCE_SLOTS;

  return slots.find((slot) => currentTime >= slot.start && currentTime < slot.end);
};

const recordActivity = async ({ id, existingActivity, activity }) => {
  const updatedActivity = [
    ...(existingActivity || []),
    activity,
  ];

  const { error } = await supabase
    .from("yoga_signups")
    .update({ activity: updatedActivity })
    .eq("ref_user_id", id);

  if (error) throw error;
};

// POST /free-thrive-yoga/attendance/evening
router.post("/", async (req, res) => {
  try {
    const id = req.body?.id;

    // Validate ID
    if ((typeof id !== "string" || !id.trim()) &&
        (typeof id !== "number" || !Number.isFinite(id) || id <= 0)) {
      return res.status(400).json({ error: "Invalid ID", code: "INVALID_ID" });
    }

    const { currentTime, todayDate, currentDateTime } = getISTDateTime();

    console.log("API Called At:", currentDateTime);
    console.log("Received ID:", id);  

    // Fetch existing record
    const { data: existingUser, error: fetchError } = await supabase
      .from("yoga_signups")
      .select("attendance, activity, current_session_date")
      .eq("ref_user_id", id)
      .single();

    if (fetchError) {
      // PGRST116 = No rows found
      if (fetchError.code === "PGRST116") {
        return res.status(400).json({ error: "Invalid ID", code: "USER_NOT_FOUND" });
      }
      throw fetchError;
    }

    if (!existingUser) {
      return res.status(400).json({ error: "Invalid ID", code: "USER_NOT_FOUND" });
    }

    const dayNumber = calculateDayNumber(existingUser.current_session_date, todayDate);

    if (dayNumber === null) {
      return res.status(400).json({
        error: "current_session_date not found or invalid for user",
        code: "INVALID_SESSION_DATE",
      });
    }

    if (dayNumber < 1) return res.status(400).json({ error: "Program has not started", code: "PROGRAM_NOT_STARTED", data: { current_session_date: existingUser.current_session_date } });
    if (dayNumber > 14) return res.status(400).json({ error: "Your 14-day yoga program has been completed.", code: "PROGRAM_ENDED", data: { dayNumber } });

    // Fetch this user's session link for today and their calculated day number.
    const { data: sessionData, error: sessionError } = await supabase
      .from("free_session_link")
      .select("link, session_number")
      .eq("session_date", todayDate)
      .eq("session_type", "evening")
      .eq("session_number", dayNumber)
      .single();


    if (sessionError?.code === "PGRST116" || (!sessionData && !sessionError)) return res.status(400).json({ error: "No session is available for today.", code: "SESSION_NOT_FOUND", data: { dayNumber, sessionType: "evening" } });
    if (sessionError) throw sessionError;

    const sessionLink = sessionData?.link ?? null;
    const firstSlotStart = [7, 14].includes(Number(dayNumber))
      ? SPECIAL_EVENING_ATTENDANCE_SLOTS[0].start
      : EVENING_ATTENDANCE_SLOTS[0].start;

    if (currentTime < firstSlotStart) {
      return res.status(200).json({
        success: true,
        code: "SESSION_EARLY_ACCESS",
        message: "Session available",
        type: "session",
        link: sessionLink,
        data: { dayNumber, sessionType: "evening" },
      });
    }

    const attendanceSlot = getAttendanceSlot(currentTime, dayNumber);
    const isEveningTime = Boolean(attendanceSlot);

    const attendance = Array.isArray(existingUser.attendance)
      ? existingUser.attendance
      : [];
    const activity = Array.isArray(existingUser.activity)
      ? existingUser.activity
      : [];
    const hasTodayAttendance = attendance.includes(todayDate);
    const hasSlotAttendanceActivity = activity.some(
      (item) =>
        item?.type === "attendance" &&
        item?.date === todayDate &&
        item?.session_type === "evening" &&
        item?.slot_start === attendanceSlot?.start
    );

    const activityRecord = isEveningTime
      ? {
          date: todayDate,
          time: currentDateTime,
          type: hasSlotAttendanceActivity ? "duplicate_attendance_attempt" : "attendance",
          session_type: "evening",
          slot_start: attendanceSlot.start,
          slot_end: attendanceSlot.end,
          present_message_time: attendanceSlot.presentMessageTime,
          present_message_sent: false,
          present_message_sent_at: null,
        }
      : {
          date: todayDate,
          time: currentDateTime,
          type: "invalid_attendance_attempt",
          session_type: "evening",
          reason: "outside_session_time",
        };

    if (isEveningTime) {
      // ---- UPDATE ATTENDANCE ----
      const updatedAttendance = [...new Set([...attendance, todayDate])];
      const updatedActivity = [...activity, activityRecord];

      const { error } = await supabase
        .from("yoga_signups")
        .update({
          attendance: hasTodayAttendance ? attendance : updatedAttendance,
          activity: updatedActivity,
        })
        .eq("ref_user_id", id);

      if (error) throw error;

      console.log("link", sessionLink);

      return res.status(200).json({
        success: true,
        code: hasSlotAttendanceActivity ? "ALREADY_ATTENDED" : "ATTENDANCE_RECORDED",
        message: hasSlotAttendanceActivity ? "Attendance has already been recorded for this session." : "Evening attendance recorded",
        type: "attendance",
        link: sessionLink,
        data: { dayNumber, sessionType: "evening" },
      });
    } else {
      // ---- UPDATE ACTIVITY ----
      await recordActivity({
        id,
        existingActivity: activity,
        activity: activityRecord,
      });

      console.log("link", sessionLink);

      return res.status(200).json({
        success: true,
        code: "OUTSIDE_ATTENDANCE_WINDOW",
        message: "Activity recorded",
        type: "activity",
        link: sessionLink,
        data: { dayNumber, sessionType: "evening" },
      });
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "An internal error occurred.", code: "INTERNAL_ERROR" });
  }
});

export default router;
