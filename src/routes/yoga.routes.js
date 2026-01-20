import express from 'express';
import { supabase } from '../lib/supabase.js';
import { processPhone } from "../utils/phoneUtils.js"; 

import { sendAiSensyYogaSignup } from "./aisensy/intiateautomation.js";


const router = express.Router();


router.post("/yoga/signup", async (req, res, next) => {
  try {
    const { name, phone, countryCode, referral, coach_ref } = req.body;

    if (!name || !phone || !countryCode) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 🔥 PROCESS PHONE FOR ANY COUNTRY
    const phoneData = processPhone(phone, countryCode);
    if (!phoneData) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone data",
      });
    }

    const { localPhone, whatsappPhone} = phoneData;

    // CHECK DUPLICATE (LOCAL + COUNTRY)
    const { data: existingUser } = await supabase
      .from("yoga_signups")
      .select("id")
      .eq("phone", localPhone)
      .eq("country_code", countryCode)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    // INSERT → STORE CLEAN DATA
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ref_user_id = `${name.replace(/\s+/g, "").toLowerCase()}_${randomCode}`;

    const { data: newUserData, error } = await supabase
  .from("yoga_signups")
  .insert({
    name,
    phone: localPhone,
    country_code: countryCode,
    referral,
    coach_ref,
    ref_user_id,
  })
  .select()
  .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Database insert failed",
      });
    }

    const { data: program } = await supabase
      .from("free_yoga_programs_data")
      .select("start_date")
      .order("start_date", { ascending: false })
      .limit(1)
      .single();


    const programStartDate = program?.start_date || "soon";

  
   sendAiSensyYogaSignup({
      whatsappPhone, 
      name,
      refId: ref_user_id,
      userId: newUserData.id,
      startDate: programStartDate,
    });


    
    res.status(200).json({
      success: true,
      message: "Signup successful",
    });
  } catch (err) {
    next(err);
  }
});

// to get yoga signups
router.get('/get-yoga', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('yoga_signups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch yoga signups'
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    next(err);
  }
});

export default router;
