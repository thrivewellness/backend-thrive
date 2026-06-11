import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { sendInstTestimonails } from "./campaigns/intractions/sendtestimonails.js";

export const triggerInstTestimonails = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number: ", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
      .select("*")
      .eq("is_active", true)


  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await sendInstTestimonails({
        whatsappPhone,
        name: user.name,
        dayNumber
      });

      console.log(`> Sent to ${user.id}`);
    } catch (err) {
      console.error(`> Failed for ${user.id}`, err.message);
    }

    // WhatsApp safety delay
    await delay(200);
  }

  console.log("> Yoga campaign finished");
};

