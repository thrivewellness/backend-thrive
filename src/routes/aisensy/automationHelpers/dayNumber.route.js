import express from 'express';
import { supabase } from '../../../lib/supabase.js';

const router = express.Router();

// POST /webhook/day-number
router.post('/day-number/evening', async (req, res) => {
    console.log('Received request for day number webhook with body:', req.query);
  try {
    const { user_id, phone } = req.query;

    if (!user_id || !phone) {
      return res.status(400).json({
        success: false,
        error: 'user_id and phone are required'
      });
    }

    const normalizedPhone = phone
      .toString()
      .trim()
      .replace(/\s+/g, '')
      .replace(/^\+/, '');

    let phoneNumber = normalizedPhone;
    if (phoneNumber.startsWith('91') && phoneNumber.length === 12) {
      phoneNumber = phoneNumber.slice(2);
    }

    const countryCode = '+91';

    let user = null;

    const { data: userById, error: userByIdError } = await supabase
      .from('yoga_signups')
      .select('id, phone, country_code')
      .eq('id', user_id)
      .single();

    if (!userByIdError && userById) {
      user = userById;
    } else {
      const { data: userByPhone, error: userByPhoneError } = await supabase
        .from('yoga_signups')
        .select('id, phone, country_code')
        .eq('phone', phoneNumber)
        .eq('country_code', countryCode)
        .single();

      if (!userByPhoneError && userByPhone) {
        user = userByPhone;
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'user not found'
      });
    }

    const todayIST = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata'
    });

    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns_data')
      .select('day_number')
      .eq('campaign_date', todayIST)
      .eq('session_name', 'evening') 
      .single();

    if (campaignError || !campaign) {
      return res.status(404).json({
        success: false,
        error: 'no campaign data for today'
      });
    }

    return res.status(200).json({
      success: true,
      user_exists: true,
      day_number: campaign.day_number
    });
  } catch (err) {
    console.error('day-number webhook error:', err);
    return res.status(500).json({
      success: false,
      error: 'internal server error'
    });
  }
});

router.post('/day-number/morning', async (req, res) => {
    console.log('Received request for day number webhook with body:', req.query);
  try {
    const { user_id, phone } = req.query;

    if (!user_id || !phone) {
      return res.status(400).json({
        success: false,
        error: 'user_id and phone are required'
      });
    }

    const normalizedPhone = phone
      .toString()
      .trim()
      .replace(/\s+/g, '')
      .replace(/^\+/, '');

    let phoneNumber = normalizedPhone;
    if (phoneNumber.startsWith('91') && phoneNumber.length === 12) {
      phoneNumber = phoneNumber.slice(2);
    }

    const countryCode = '+91';

    let user = null;

    const { data: userById, error: userByIdError } = await supabase
      .from('yoga_signups')
      .select('id, phone, country_code')
      .eq('id', user_id)
      .single();

    if (!userByIdError && userById) {
      user = userById;
    } else {
      const { data: userByPhone, error: userByPhoneError } = await supabase
        .from('yoga_signups')
        .select('id, phone, country_code')
        .eq('phone', phoneNumber)
        .eq('country_code', countryCode)
        .single();

      if (!userByPhoneError && userByPhone) {
        user = userByPhone;
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'user not found'
      });
    }

    const todayIST = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata'
    });

    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns_data')
      .select('day_number')
      .eq('campaign_date', todayIST)
      .eq('session_name', 'morning') 
      .single();

    if (campaignError || !campaign) {
      return res.status(404).json({
        success: false,
        error: 'no campaign data for today'
      });
    }

    return res.status(200).json({
      success: true,
      user_exists: true,
      day_number: campaign.day_number
    });
  } catch (err) {
    console.error('day-number webhook error:', err);
    return res.status(500).json({
      success: false,
      error: 'internal server error'
    });
  }
});


export default router;
