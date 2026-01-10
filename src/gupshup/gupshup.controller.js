import { sendTemplateMessage } from "./gupshup.service.js";
import { TEMPLATES, EVENTS } from "./gupshup.constants.js";
import { supabase } from "../lib/supabase.js";

/**
 * Extract country code & phone
 * 918050717704 → { countryCode: "+91", phone: "8050717704" }
 */
function extractPhone(waId) {
  const digits = waId.replace(/\D/g, "");

  console.log("Extracting phone from waId:", waId, "->", digits);

  // India case (you can extend later)
  if (digits.startsWith("91") && digits.length === 12) {
    return {
      countryCode: "+91",
      phone: digits.slice(2)
    };
  }

  // fallback
  return {
    countryCode: `+${digits.slice(0, digits.length - 10)}`,
    phone: digits.slice(-10)
  };
}

export async function handleWebhook(req, res) {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    const messageObj = value?.messages?.[0];
    const contact = value?.contacts?.[0];

    if (!messageObj || !contact) {
      return res.sendStatus(200);
    }

    const messageText = messageObj.text?.body?.toLowerCase();
    const waId = contact.wa_id; // 918050717704

    if (messageText !== EVENTS.START) {
      return res.sendStatus(200);
    }

    const { phone, countryCode } = extractPhone(waId);

    // 🔍 Fetch user
    const { data: user, error: userError } = await supabase
      .from("yoga_signups")
      .select("name")
      .eq("phone", phone)
      .single();

    if (userError || !user) {
      console.log("User not found:", phone);
      return res.sendStatus(200);
      }

      // 🔍 Fetch latest program start date
      const { data: program, error: programError } = await supabase
          .from("free_yoga_programs_data")
          .select("start_date")
          .order("start_date", { ascending: false })
          .limit(1)
          .single();

    if (programError || !program) {
      console.log("Program not found:", phone);
      return res.sendStatus(200);
    }

    // ✅ Send template
    await sendTemplateMessage({
      phone: waId, // send back full waId
      templateName: TEMPLATES.WELCOME_NEW,
      name: user.name,
      date: program.start_date 
    });

    return res.sendStatus(200);
  } catch (err) {
    console.error("Gupshup webhook error:", err);
    return res.sendStatus(500);
  }
}
