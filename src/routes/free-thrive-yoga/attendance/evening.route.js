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

const recordActivity = async ({ id, existingActivity, todayDate, currentDateTime }) => {
  const updatedActivity = [
    ...(existingActivity || []),
    { date: todayDate, time: currentDateTime },
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
    const isSpecialDay = dayNumber === 7 || dayNumber === 14;

    // Time range check
    const isEveningTime = isSpecialDay
      ? currentTime >= "18:00" && currentTime <= "19:00"
      : currentTime >= "17:25" && currentTime <= "20:30";

    const attendance = Array.isArray(existingUser.attendance)
      ? existingUser.attendance
      : [];
    const hasTodayAttendance = attendance.includes(todayDate);

    if (isEveningTime && !hasTodayAttendance) {
      // ---- UPDATE ATTENDANCE ----
      const updatedAttendance = [...new Set([...attendance, todayDate])];

      const { error } = await supabase
        .from("yoga_signups")
        .update({ attendance: updatedAttendance })
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
        existingActivity: existingUser.activity,
        todayDate,
        currentDateTime,
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
