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
    const { id } = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const { currentTime, todayDate, currentDateTime } = getISTDateTime();

    console.log("API Called At:", currentDateTime);
    console.log("Received ID:", id);  

    // Fetch existing record
    const { data: existingUser, error: fetchError } = await supabase
      .from("yoga_signups")
      .select("attendance, activity")
      .eq("ref_user_id", id)
      .single();

    if (fetchError) {
      // PGRST116 = No rows found
      if (fetchError.code === "PGRST116") {
        return res.status(400).json({ error: "Invalid ID" });
      }
      throw fetchError;
    }

    if (!existingUser) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // Fetch today's campaign link
    const { data: campaignData, error: campaignError } = await supabase
      .from("campaigns_data")
      .select("link, day_number")
      .eq("campaign_date", todayDate)
      .eq("session_name", "evening")
      .single();


    if (campaignError && campaignError.code !== "PGRST116") throw campaignError;

    const campaignLink = campaignData?.link ?? null;
    const dayNumber = Number(campaignData?.day_number);
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
        item?.present_message_time === attendanceSlot?.presentMessageTime
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

      console.log("link", campaignLink);

      return res.status(200).json({
        success: true,
        message: "Evening attendance recorded",
        type: "attendance",
        link: campaignLink,
      });
    } else {
      // ---- UPDATE ACTIVITY ----
      await recordActivity({
        id,
        existingActivity: activity,
        activity: activityRecord,
      });

      console.log("link", campaignLink);

      return res.status(200).json({
        success: true,
        message: "Activity recorded",
        type: "activity",
        link: campaignLink,
      });
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
