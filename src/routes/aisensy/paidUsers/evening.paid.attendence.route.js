import express from "express";
import { supabase } from "../../../lib/supabase.js";

const router = express.Router();

const BASIC_PLAN = "basic";

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

const EVENING_ATTENDANCE_SLOTS = [
  { start: "17:15", end: "18:20", presentMessageTime: "18:30" },
  { start: "18:20", end: "19:20", presentMessageTime: "19:30" },
  { start: "19:20", end: "20:30", presentMessageTime: "20:35" },
];

const getAttendanceSlot = (currentTime) =>
  EVENING_ATTENDANCE_SLOTS.find(
    (slot) => currentTime >= slot.start && currentTime < slot.end
  );

const getSessionLink = async ({ plan, todayDate }) => {
  const isBasicPlan = plan?.trim().toLowerCase() === BASIC_PLAN;

  const query = supabase.from("session_links").select("link");

  if (isBasicPlan) {
    query
      .eq("date", todayDate)
      .eq("session_category", "paid")
      .eq("session_type", "evening");
  } else {
    query.eq("id", 1).eq("session_name", "advance");
  }

  const { data, error } = await query.single();

  if (error && error.code !== "PGRST116") throw error;

  return data?.link ?? null;
};

const recordActivity = async ({ id, existingActivity, activity }) => {
  const updatedActivity = [...(existingActivity || []), activity];

  const { error } = await supabase
    .from("paid_users")
    .update({ activity: updatedActivity })
    .eq("ref_user_id", id);

  if (error) throw error;
};

// POST /paid-user/attendance/evening
router.post("/", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const { currentTime, todayDate, currentDateTime } = getISTDateTime();

    console.log("Paid Evening Attendance API Called At:", currentDateTime);
    console.log("Received ID:", id);

    const { data: existingUser, error: fetchError } = await supabase
      .from("paid_users")
      .select("attendance, activity, plan")
      .eq("ref_user_id", id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return res.status(400).json({ error: "Invalid ID" });
      }
      throw fetchError;
    }

    if (!existingUser) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const sessionLink = await getSessionLink({
      plan: existingUser.plan,
      todayDate,
    });
    const attendanceSlot = getAttendanceSlot(currentTime);
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
      const updatedAttendance = [...new Set([...attendance, todayDate])];
      const updatedActivity = [...activity, activityRecord];

      const { error } = await supabase
        .from("paid_users")
        .update({
          attendance: hasTodayAttendance ? attendance : updatedAttendance,
          activity: updatedActivity,
        })
        .eq("ref_user_id", id);

      if (error) throw error;

      console.log("link", sessionLink);

      return res.status(200).json({
        success: true,
        message: "Evening attendance recorded",
        type: "attendance",
        link: sessionLink,
      });
    }

    await recordActivity({
      id,
      existingActivity: activity,
      activity: activityRecord,
    });

    console.log("link", sessionLink);

    return res.status(200).json({
      success: true,
      message: "Activity recorded",
      type: "activity",
      link: sessionLink,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
