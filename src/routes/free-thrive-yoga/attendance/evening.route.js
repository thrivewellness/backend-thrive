import express from "express";
import dayjs from "dayjs";
import {supabase} from "../../../lib/supabase.js";

const router = express.Router();

// POST /free-thrive-yoga/attendance/evening
router.post("/", async (req, res) => {
  try {
    const { id } = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const now = dayjs();
    const currentTime = now.format("HH:mm");
    const todayDate = now.format("YYYY-MM-DD");
    const currentDateTime = now.format("YYYY-MM-DD HH:mm:ss");

    console.log("API Called At:", currentDateTime);
    console.log("Received ID:", id);  

    // Time range check
    const isEveningTime =
      currentTime >= "17:25" && currentTime <= "20:30";

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
      .select("link")
      .eq("campaign_date", todayDate)
      .eq("session_name", "evening")
      .single();


    if (campaignError && campaignError.code !== "PGRST116") throw campaignError;

    const campaignLink = campaignData?.link ?? null;

    

    if (isEveningTime) {
      // ---- UPDATE ATTENDANCE ----
      const updatedAttendance = [
        ...(existingUser.attendance || []),
        todayDate,
      ];

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
      const updatedActivity = [
        ...(existingUser.activity || []),
        { date: todayDate, time: currentDateTime },
      ];

      const { error } = await supabase
        .from("yoga_signups")
        .update({ activity: updatedActivity })
        .eq("ref_user_id", id);

      if (error) throw error;

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