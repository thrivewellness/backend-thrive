import express from 'express';
import { supabase } from '../../../lib/supabase.js';

const router = express.Router();

const getTodayIST = () => new Date().toLocaleDateString('en-CA', {
  timeZone: 'Asia/Kolkata'
});

const calculateDayNumber = (currentSessionDate, todayDate) => {
  if (!currentSessionDate) {
    return null;
  }

  const sessionDate = currentSessionDate.toString().slice(0, 10);
  const sessionStart = new Date(`${sessionDate}T00:00:00+05:30`);
  const today = new Date(`${todayDate}T00:00:00+05:30`);

  if (Number.isNaN(sessionStart.getTime()) || Number.isNaN(today.getTime())) {
    return null;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((today - sessionStart) / millisecondsPerDay) + 1;
};

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
      .select('id, phone, country_code, current_session_date')
      .eq('id', user_id)
      .single();

    if (!userByIdError && userById) {
      user = userById;
    } else {
      const { data: userByPhone, error: userByPhoneError } = await supabase
        .from('yoga_signups')
        .select('id, phone, country_code, current_session_date')
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

    const todayIST = getTodayIST();
    const dayNumber = calculateDayNumber(user.current_session_date, todayIST);

    if (!dayNumber || dayNumber < 1) {
      return res.status(404).json({
        success: false,
        error: 'current_session_date not found or invalid for user'
      });
    }

    return res.status(200).json({
      success: true,
      user_exists: true,
      day_number: dayNumber
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
      .select('id, phone, country_code, current_session_date')
      .eq('id', user_id)
      .single();

    if (!userByIdError && userById) {
      user = userById;
    } else {
      const { data: userByPhone, error: userByPhoneError } = await supabase
        .from('yoga_signups')
        .select('id, phone, country_code, current_session_date')
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

    const todayIST = getTodayIST();
    const dayNumber = calculateDayNumber(user.current_session_date, todayIST);

    if (!dayNumber || dayNumber < 1) {
      return res.status(404).json({
        success: false,
        error: 'current_session_date not found or invalid for user'
      });
    }

    return res.status(200).json({
      success: true,
      user_exists: true,
      day_number: dayNumber
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
