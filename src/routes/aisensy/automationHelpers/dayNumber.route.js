import express from 'express';
import { supabase } from '../../../lib/supabase.js';
import { processQueryPhoneForLookup } from '../../../utils/phoneUtils.js';

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

const getWeekdayRomanNumber = () => {
  const romanDays = ['vii', 'i', 'ii', 'iii', 'iv', 'v', 'vi'];
  const weekday = new Date().toLocaleDateString('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short'
  });
  const weekdayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekday);

  return romanDays[weekdayIndex] || null;
};

const findYogaSignupUser = async ({ userId, phoneNumbers, countryCodePairs }) => {
  let user = null;

  const { data: userById, error: userByIdError } = await supabase
    .from('yoga_signups')
    .select('id, phone, country_code, current_session_date, ref_user_id')
    .eq('id', userId)
    .single();

  if (!userByIdError && userById) {
    return userById;
  }

  for (const pair of countryCodePairs) {
    const { data: userByPhone, error: userByPhoneError } = await supabase
      .from('yoga_signups')
      .select('id, phone, country_code, current_session_date, ref_user_id')
      .eq('phone', pair.phone)
      .eq('country_code', pair.countryCode)
      .single();

    if (!userByPhoneError && userByPhone) {
      user = userByPhone;
      break;
    }
  }

  if (!user && phoneNumbers.length) {
    const { data: userByAnyPhone, error: userByAnyPhoneError } = await supabase
      .from('yoga_signups')
      .select('id, phone, country_code, current_session_date, ref_user_id')
      .in('phone', phoneNumbers)
      .limit(1)
      .maybeSingle();

    if (!userByAnyPhoneError && userByAnyPhone) {
      user = userByAnyPhone;
    }
  }

  return user;
};

const findPaidUser = async ({ phoneNumbers, countryCodePairs }) => {
  for (const pair of countryCodePairs) {
    const { data: paidUser, error: paidUserError } = await supabase
      .from('paid_users')
      .select('id, phone, country_code, plan, plan_end_date, status, is_active, ref_user_id')
      .eq('phone', pair.phone)
      .eq('country_code', pair.countryCode)
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!paidUserError && paidUser) {
      return paidUser;
    }
  }

  if (!phoneNumbers.length) {
    return null;
  }

  const { data: paidUser, error: paidUserError } = await supabase
    .from('paid_users')
    .select('id, phone, country_code, plan, plan_end_date, status, is_active, ref_user_id')
    .in('phone', phoneNumbers)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (paidUserError || !paidUser) {
    return null;
  }

  return paidUser;
};

const handlePaidUserFallback = async ({ phoneNumbers, countryCodePairs, hasYogaSignup }) => {
  const paidUser = await findPaidUser({ phoneNumbers, countryCodePairs });

  if (!paidUser) {
    return {
      success: true,
      user_exists: hasYogaSignup,
      day_number: hasYogaSignup ? '0' : '000',
      ref_user_id: null
    };
  }

  const todayIST = getTodayIST();
  const isPlanActive = paidUser.is_active === true
    && paidUser.plan_end_date
    && paidUser.plan_end_date.toString().slice(0, 10) >= todayIST;

  return {
    success: true,
    user_exists: true,
    day_number: isPlanActive ? getWeekdayRomanNumber() : '00',
    ref_user_id: isPlanActive ? paidUser.ref_user_id : null
  };
};

const handleYogaSignupDayLimitFallback = async ({ phoneNumbers, countryCodePairs }) => {
  const paidUser = await findPaidUser({ phoneNumbers, countryCodePairs });

  return {
    success: true,
    user_exists: true,
    day_number: paidUser ? getWeekdayRomanNumber() : '0',
    ref_user_id: paidUser ? paidUser.ref_user_id : null
  };
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

    const { phoneNumbers, countryCodePairs } = processQueryPhoneForLookup(phone);
    const user = await findYogaSignupUser({
      userId: user_id,
      phoneNumbers,
      countryCodePairs
    });

    if (!user) {
      const paidUserResponse = await handlePaidUserFallback({
        phoneNumbers,
        countryCodePairs,
        hasYogaSignup: false
      });

      return res.status(200).json(paidUserResponse);
    }

    const todayIST = getTodayIST();
    const dayNumber = calculateDayNumber(user.current_session_date, todayIST);

    if (!dayNumber) {
      return res.status(404).json({
        success: false,
        error: 'current_session_date not found or invalid for user'
      });
    }

    if (dayNumber >= 15) {
      const paidUserResponse = await handleYogaSignupDayLimitFallback({
        phoneNumbers,
        countryCodePairs
      });

      return res.status(200).json(paidUserResponse);
    }

    return res.status(200).json({
      success: true,
      user_exists: true,
      day_number: dayNumber,
      ref_user_id: user.ref_user_id
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

    const { phoneNumbers, countryCodePairs } = processQueryPhoneForLookup(phone);
    const user = await findYogaSignupUser({
      userId: user_id,
      phoneNumbers,
      countryCodePairs
    });

    if (!user) {
      const paidUserResponse = await handlePaidUserFallback({
        phoneNumbers,
        countryCodePairs,
        hasYogaSignup: false
      });

      return res.status(200).json(paidUserResponse);
    }

    const todayIST = getTodayIST();
    const dayNumber = calculateDayNumber(user.current_session_date, todayIST);

    if (!dayNumber) {
      return res.status(404).json({
        success: false,
        error: 'current_session_date not found or invalid for user'
      });
    }

    if (dayNumber >= 15) {
      const paidUserResponse = await handleYogaSignupDayLimitFallback({
        phoneNumbers,
        countryCodePairs
      });

      return res.status(200).json(paidUserResponse);
    }

    return res.status(200).json({
      success: true,
      user_exists: true,
      day_number: dayNumber,
      ref_user_id: user.ref_user_id
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
