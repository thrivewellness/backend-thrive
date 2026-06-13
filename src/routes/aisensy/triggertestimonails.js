import { supabase } from "../../lib/supabase.js";
import { delay } from "../../utils/delay.js";
import { send15MinDrill } from "./campaigns/intractions/send15MinDrill.js";
import { sendInstTestimonails } from "./campaigns/intractions/sendtestimonails.js";

export const triggerInstTestimonails = async (dayNumber) => {
  console.log("> Yoga campaign started");
  console.log("> day number:", dayNumber);

  const { data: users } = await supabase
    .from("yoga_signups")
    .select("*")
    .gt("id", 4224); // only users after ID 4224

  if (!users?.length) {
    console.log("> No users found");
    return;
  }

  console.log(`> Total users found: ${users.length}`);

  let successCount = 0;
  let failureCount = 0;

  for (const user of users) {
    const whatsappPhone = `${user.country_code}${user.phone}`.replace(/\D/g, "");

    try {
      await send15MinDrill({
        whatsappPhone,
        name: user.name,
        dayNumber,
      });

      successCount++;
      console.log(`> Sent to ${user.id}`);
    } catch (err) {
      failureCount++;
      console.error(`> Failed for ${user.id}`, err.message);
    }

    // WhatsApp safety delay
    await delay(200);
  }

  console.log("> Yoga campaign finished");
  console.log(`> Total users: ${users.length}`);
  console.log(`> Successfully sent: ${successCount}`);
  console.log(`> Failed: ${failureCount}`);
};

