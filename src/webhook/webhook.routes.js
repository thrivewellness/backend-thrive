import express from "express"
import { supabase } from "../lib/supabase.js";

const router = express.Router()

//webhook where aisensy api call check user info
router.post("/get-user", async (req, res) => {
  try {
    const { phone } = req.query

    if (!phone) {
      return res.status(400).json({ user: "no" })
    }

    let countryCode = "+91"
    let phoneNumber = phone

    if (phone.startsWith("91") && phone.length === 12) {
      phoneNumber = phone.slice(2) // remove country code
    }

    const { data: user, error } = await supabase
      .from("yoga_signups")
      .select("name, ref_user_id, id")
      .eq("phone", phoneNumber)
      .eq("country_code", countryCode)
      .single()

    if (error || !user) {
      return res.status(201).json({ user: "no" })
    }

    return res.json({
      user: "yes",
      name: user.name,
      startDate: "27 Jan 2026",
      refId: user.ref_user_id,
      userId: user.id
    })

  } catch (err) {
    console.error("AiSensy webhook error:", err)
    return res.status(400).json({ user: "no" })
  }
})


export default router
