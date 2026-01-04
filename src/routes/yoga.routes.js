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

    const { error } = await supabase
      .from('yoga_signups')
      .insert({
        name,
        phone,
        country_code: countryCode,
        referral,
        coach_ref
      });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Database insert failed'
      });
    }

    res.status(200).json({ success: true });
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
