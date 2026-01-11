import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

//post for yoga sinups

router.post('/yoga/signup', async (req, res, next) => {
  try {
    const { name, phone, countryCode, referral, coach_ref } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // 1️⃣ CHECK IF PHONE ALREADY EXISTS
    const { data: existingUser, error: checkError } = await supabase
      .from('yoga_signups')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Mobile number already exists'
      });
    }

    // 2️⃣ GENERATE ref_user_id
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ref_user_id = `${name.replace(/\s+/g, '').toLowerCase()}_${randomCode}`;

    // 3️⃣ INSERT DATA
    const { error } = await supabase
      .from('yoga_signups')
      .insert({
        name,
        phone,
        country_code: countryCode,
        referral,
        coach_ref,
        ref_user_id
      });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Database insert failed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Signup successful'
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
