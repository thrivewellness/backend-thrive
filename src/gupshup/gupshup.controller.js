import { supabase } from "../lib/supabase.js";
import {
  sendTemplateMessage,
  sendImageMessage,
  sendTextMessage,
  sendWelcomeTemplate,
  sendStep2Message,
  sendTemplateMessageWithImage,
  sendWhatsAppImagMessage,
  
} from "./gupshup.service.js";
import { TEMPLATES, EVENTS } from "./gupshup.constants.js";

/**
 * Extract phone from WhatsApp ID
 */
function extractPhone(waId) {
  const digits = waId.replace(/\D/g, "");

  if (digits.startsWith("91") && digits.length === 12) {
    return digits.slice(2);
  }

  return digits.slice(-10);
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

    const waId = contact.wa_id;
    const messageText = messageObj.text?.body;
    const buttonPayload = messageObj.button?.payload;

    const phone = extractPhone(waId);

    /* ================= START ================= */
    if (messageText === EVENTS.START) {
      const { data: user } = await supabase
        .from("yoga_signups")
        .select("name")
        .eq("phone", phone)
        .single();

      const { data: program } = await supabase
        .from("free_yoga_programs_data")
        .select("start_date")
        .order("start_date", { ascending: false })
        .limit(1)
        .single();

      if (!user || !program) return res.sendStatus(200);

      await sendWelcomeTemplate({
        phone: waId,
        name: user.name,
        startDate: program.start_date
      });

      return res.sendStatus(200);
    }

    /* ================= STEP 2 ================= */
    if (buttonPayload === EVENTS.STEP_2) {
      await sendStep2Message({
        phone: waId,
        templateId: TEMPLATES.STEP_2,
        startDate: "Monday, 18th January",
        ImgaeUrl: "https://fss.gupshup.io/0/public/0/0/gupshup/919355221522/d3c6c611-b822-41ea-86e6-fad4824d54eb/1767892465557_1%2810%29.jpg"
      });

      return res.sendStatus(200);
    }

    /* ================= STEP 3 ================= */
    if (buttonPayload === EVENTS.STEP_3) {
      await sendTemplateMessage({
        phone: waId,
        templateId: TEMPLATES.STEP_3,
        params: []
      });

      return res.sendStatus(200);
    }
    /* ================= INVITE FRIENDS ================= */
    if (buttonPayload === EVENTS.INVITE_FRIENDS) {

      // 🔍 Fetch ref_user_id
      const { data: user, error } = await supabase
        .from("yoga_signups")
        .select("ref_user_id")
        .eq("phone", phone)
        .single();

      if (error || !user?.ref_user_id) {
        console.log("ref_user_id not found for:", phone);
        return res.sendStatus(200);
      }

      // 🔗 Referral link message (NO IMAGE)
      await sendTextMessage({
        phone: waId,
        text: `Forward below message to your close ones & WIN when they JOIN ⬇️`
      });


      const referralLink = `https://thriveyoga.thrivewellness.in/?ref=${user.ref_user_id}`;


      await sendWhatsAppImagMessage(
        {
          destination: phone,
          imageUrl: "https://fss.gupshup.io/0/public/0/0/gupshup/919355221522/d3c6c611-b822-41ea-86e6-fad4824d54eb/1767892465557_1%2810%29.jpg",
          caption: `I personally invite you to experience *THRIVE YOGA*
An Exercise Program by Thrive Wellness

*FREE | 14-Day Online Program*

📅 *Starts* 19 Jan 2026
⏰ *5 Batches Daily, Join Anytime*

Designed to help you:
🔥 Support fat loss
🏋️ Reduce body Pain & stiffness
🧍 Move with confidence
⏳ Improve longevity

Led by *Satyam Patkar & Bobby Rajput*
Certified Exercise & Nutrition Expert | 6+ Years Exp

👇 Click below to join the *FREE 14-Day Thrive Yoga Program*
\n${referralLink}`
        }
      )
{/*
      await sendTemplateMessageWithImage({
        phone: waId,
        templateId: TEMPLATES.INVITE_FRIENDS,
        params: ["19 jan 2026", referralLink],
        ImageUrl: "https://fss.gupshup.io/0/public/0/0/gupshup/919355221522/d3c6c611-b822-41ea-86e6-fad4824d54eb/1767892465557_1%2810%29.jpg"
      })
*/}

      // 🖼️ Image + caption message
      {/*await sendImageMessage({
        phone: waId,
        imageUrl: "https://fss.gupshup.io/0/public/0/0/gupshup/919355221522/d3c6c611-b822-41ea-86e6-fad4824d54eb/1767892465557_1%2810%29.jpg",
        caption:
          `I personally invite you to experience *THRIVE YOGA*
An Exercise Program by Thrive Wellness

*FREE | 14-Day Online Program*

📅 *Starts*
⏰ *5 Batches Daily, Join Anytime*

Designed to help you:
🔥 Support fat loss
🏋️ Reduce body Pain & stiffness
🧍 Move with confidence
⏳ Improve longevity

Led by *Satyam Patkar & Bobby Rajput*
Certified Exercise & Nutrition Expert | 6+ Years Exp

👇 Click below to join the *FREE 14-Day Thrive Yoga Program*
\n${referralLink}`
      });*/}



      {/*await sendTextMessage(
        {
          phone: waId,  
          text: `I personally invite you to experience *THRIVE YOGA*
An Exercise Program by Thrive Wellness

*FREE | 14-Day Online Program*

📅 *Starts*
⏰ *5 Batches Daily, Join Anytime*

Designed to help you:
🔥 Support fat loss
🏋️ Reduce body Pain & stiffness
🧍 Move with confidence
⏳ Improve longevity

Led by *Satyam Patkar & Bobby Rajput*
Certified Exercise & Nutrition Expert | 6+ Years Exp

👇 Click below to join the *FREE 14-Day Thrive Yoga Program*
\n${referralLink}`
        }
      )
*/}


      return res.sendStatus(200);
    }


    /* ================= SHARE ON WHATSAPP ================= */
    if (buttonPayload === EVENTS.SHARE_WHATSAPP) {


      // 🔍 Fetch ref_user_id
      const { data: user, error } = await supabase
        .from("yoga_signups")
        .select("ref_user_id")
        .eq("phone", phone)
        .single();

      if (error || !user?.ref_user_id) {
        console.log("ref_user_id not found for:", phone);
        return res.sendStatus(200);
      }

      await sendTextMessage({
        phone: waId,
        text: `Forward below message to your close ones & WIN when they JOIN ⬇️`
      });


      const referralLink = `https://thriveyoga.thrivewellness.in/?ref=${user.ref_user_id}`;


         await sendWhatsAppImagMessage(
        {
          destination: phone,
          imageUrl: "https://fss.gupshup.io/0/public/0/0/gupshup/919355221522/d3c6c611-b822-41ea-86e6-fad4824d54eb/1767892465557_1%2810%29.jpg",
          caption: `I personally invite you to experience *THRIVE YOGA*
An Exercise Program by Thrive Wellness

*FREE | 14-Day Online Program*

📅 *Starts* 19 Jan 2026
⏰ *5 Batches Daily, Join Anytime*

Designed to help you:
🔥 Support fat loss
🏋️ Reduce body Pain & stiffness
🧍 Move with confidence
⏳ Improve longevity

Led by *Satyam Patkar & Bobby Rajput*
Certified Exercise & Nutrition Expert | 6+ Years Exp

👇 Click below to join the *FREE 14-Day Thrive Yoga Program*
\n${referralLink}`
        }
      )

     {/* await sendTemplateMessageWithImage({
        phone: waId,
        templateId: TEMPLATES.INVITE_FRIENDS,
        params: ["19 jan 2026", referralLink],
        ImageUrl: "https://fss.gupshup.io/0/public/0/0/gupshup/919355221522/d3c6c611-b822-41ea-86e6-fad4824d54eb/1767892465557_1%2810%29.jpg"
      })



       await sendImageMessage({
        phone: waId,
        imageUrl: "https://fss.gupshup.io/0/public/0/0/gupshup/919355221522/d3c6c611-b822-41ea-86e6-fad4824d54eb/1767892465557_1%2810%29.jpg",
        caption: `I personally invite you to experience *THRIVE YOGA*
An Exercise Program by Thrive Wellness

*FREE | 14-Day Online Program*

📅 *Starts*
⏰ *5 Batches Daily, Join Anytime*

Designed to help you:
🔥 Support fat loss
🏋️ Reduce body Pain & stiffness
🧍 Move with confidence
⏳ Improve longevity

Led by *Satyam Patkar & Bobby Rajput*
Certified Exercise & Nutrition Expert | 6+ Years Exp

👇 Click below to join the *FREE 14-Day Thrive Yoga Program*
\n${referralLink}`
      });*/}


      {/*await sendTextMessage(
        {
          phone: waId,  
          text: `I personally invite you to experience *THRIVE YOGA*
An Exercise Program by Thrive Wellness

*FREE | 14-Day Online Program*

📅 *Starts*
⏰ *5 Batches Daily, Join Anytime*

Designed to help you:
🔥 Support fat loss
🏋️ Reduce body Pain & stiffness
🧍 Move with confidence
⏳ Improve longevity

Led by *Satyam Patkar & Bobby Rajput*
Certified Exercise & Nutrition Expert | 6+ Years Exp

👇 Click below to join the *FREE 14-Day Thrive Yoga Program*
\n${referralLink}`
        }
      )*/}



      return res.sendStatus(200);
    }

    /* ================= WHATSAPP STATUS ================= */
    if (buttonPayload === EVENTS.WHATSAPP_STATUS) {

      // 🔍 Fetch ref_user_id
      const { data: user, error } = await supabase
        .from("yoga_signups")
        .select("ref_user_id")
        .eq("phone", phone)
        .single();

      if (error || !user?.ref_user_id) {
        console.log("ref_user_id not found for:", phone);
        return res.sendStatus(200);
      }

      await sendTextMessage({
        phone: waId,
        text: "Forward on WHATSAPP STATUS 👇"
      });

      const referralLink = `https://thriveyoga.thrivewellness.in/?ref=${user.ref_user_id}`;

       { /* await sendTemplateMessageWithImage({
        phone: waId,
        templateId: TEMPLATES.WHATSAPP_STATUS,
        params: ["19 jan 2026", referralLink],
        ImageUrl: "https://fss.gupshup.io/0/public/0/0/gupshup/919355221522/d3c6c611-b822-41ea-86e6-fad4824d54eb/1767892465557_1%2810%29.jpg"
      })

    await sendImageMessage({
        phone: waId,
        imageUrl: "https://fss.gupshup.io/0/public/0/0/gupshup/919355221522/d3c6c611-b822-41ea-86e6-fad4824d54eb/1767892465557_1%2810%29.jpg",
        caption: `Movement today is an investment in a longer, healthier life 🌱
Join a community that supports you- we grow stronger together 🤝

🧘 *FREE THRIVE YOGA | 14 Days Online*
🗓️ Starts Tomorrow
🎯 Focused on *long-term health and longevity*

CLICK TO JOIN  👉🏻 ${referralLink}`
      });*/}

      await sendTextMessage(
        {
          phone: waId,
          text: `Movement today is an investment in a longer, healthier life 🌱
Join a community that supports you- we grow stronger together 🤝

🧘 *FREE THRIVE YOGA | 14 Days Online*
🗓️ Starts Tomorrow
🎯 Focused on *long-term health and longevity*

CLICK TO JOIN  👉🏻 ${referralLink}`
        }
      )


      return res.sendStatus(200);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    return res.sendStatus(500);
  }
}
