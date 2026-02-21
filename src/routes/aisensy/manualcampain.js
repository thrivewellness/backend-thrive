import { supabase } from "../../lib/supabase.js";
import { sendAiSensyYogaSignup } from "./intiateautomation.js";

export const sendYogaSignupToRecentUsers = async () => {
  try {
    // 1️⃣ Get latest program start date
    const { data: program, error: programError } = await supabase
      .from("free_yoga_programs_data")
      .select("start_date")
      .order("start_date", { ascending: false })
      .limit(1)
      .single();

    if (programError) throw programError;

    const programStartDate = program?.start_date || "soon";

    // 2️⃣ Date filters (change year if needed)
    const jan26 = "2026-01-26";
    const feb10 = "2026-02-10";

    // 3️⃣ Fetch users between Jan 26 and Feb 10
    const { data: users, error: usersError } = await supabase
      .from("yoga_signups")
      .select("id, name, phone, country_code, ref_user_id, created_at")
      .gte("created_at", jan26)
      .lte("created_at", feb10);

    if (usersError) throw usersError;

    if (!users || users.length === 0) {
      console.log("No users found");
      return;
    }

    // 4️⃣ Send WhatsApp message
    for (const user of users) {
      if (!user.phone || !user.country_code) continue;

      // Remove "+" from country code
      const cleanCountryCode = user.country_code.replace("+", "").trim();

      // Remove spaces from phone
      const cleanPhone = user.phone.replace(/\s+/g, "").trim();

      // Combine country code + phone
      const whatsappPhone = `${cleanCountryCode}${cleanPhone}`;

      await sendAiSensyYogaSignup({
        whatsappPhone,
        name: user.name,
        refId: user.ref_user_id,
        userId: user.id,
        startDate: programStartDate,
      });
    }

    console.log(`Messages sent to ${users.length} users`);
  } catch (error) {
    console.error("Error sending yoga signup messages:", error);
  }
};