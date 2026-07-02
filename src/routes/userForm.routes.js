import express from 'express';
import { randomUUID } from 'crypto';
import { supabase } from '../lib/supabase.js';
import { processPhone } from '../utils/phoneUtils.js';
import { coachLeadRemainder } from './aisensy/campaigns/landingpage/coachLeadRemainder.js';
import { userConBooked } from './aisensy/campaigns/landingpage/userConBooked.js';

const router = express.Router();
const COACH_LEAD_WHATSAPP_PHONE = '919582201167';

const toTemplateValue = (value) => {
  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : '-';
  }

  return value || '-';
};

const normalizeLeadPhone = ({ whatsapp, countryCode }) => {
  if (!whatsapp) return null;

  if (countryCode) {
    return processPhone(whatsapp, countryCode);
  }

  const cleaned = String(whatsapp).replace(/\D/g, '').replace(/^0+/, '');
  const whatsappPhone = cleaned.startsWith('91') && cleaned.length === 12 ? cleaned : `91${cleaned}`;

  return {
    localPhone: whatsappPhone.slice(2),
    whatsappPhone
  };
};

const formatLeadPhoneForTemplate = ({ whatsapp, countryCode }) => {
  if (!whatsapp) return '-';

  const cleanedPhone = String(whatsapp).replace(/\D/g, '').replace(/^0+/, '');
  const cleanedCountryCode = countryCode
    ? String(countryCode).replace(/\D/g, '')
    : '91';
  const hasExplicitCountryCode = Boolean(countryCode);

  if (
    hasExplicitCountryCode &&
    cleanedPhone.startsWith(cleanedCountryCode) &&
    cleanedPhone.length > cleanedCountryCode.length + 6
  ) {
    return `+${cleanedCountryCode} ${cleanedPhone.slice(cleanedCountryCode.length)}`;
  }

  if (!hasExplicitCountryCode && cleanedPhone.startsWith(cleanedCountryCode) && cleanedPhone.length === 12) {
    return `+${cleanedCountryCode} ${cleanedPhone.slice(cleanedCountryCode.length)}`;
  }

  return `+${cleanedCountryCode} ${cleanedPhone}`;
};

const formatLeadCreatedAt = (value) => {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  }).format(date);

  const parts = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  }).formatToParts(date);

  const day = parts.find((part) => part.type === 'day')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const year = parts.find((part) => part.type === 'year')?.value;

  return `${time} (${day}-${month}-${year})`;
};

const getRequestFormData = (body) => {
  if (Array.isArray(body)) {
    const formEntries = body.filter((entry) => entry && typeof entry === 'object');
    const latestForm = formEntries[formEntries.length - 1] || {};

    return {
      userId: randomUUID(),
      formEntries,
      latestForm
    };
  }

  const { user_id, ...formFields } = body;

  return {
    userId: user_id || randomUUID(),
    formEntries: [formFields],
    latestForm: formFields
  };
};

const triggerLandingPageMessages = async ({ userId, formFields, createdAt }) => {
  const phoneData = normalizeLeadPhone({
    whatsapp: formFields.whatsapp,
    countryCode: formFields.countryCode
  });

  if (!phoneData) {
    console.error('Landing page lead messages skipped: invalid phone data', {
      userId,
      whatsapp: formFields.whatsapp,
      countryCode: formFields.countryCode
    });
    return;
  }

  const campaignCalls = [
    userConBooked({
      whatsappPhone: phoneData.whatsappPhone,
      name: formFields.name || 'there'
    })
  ];

  campaignCalls.push(
    coachLeadRemainder({
      id: userId,
      whatsappPhone: COACH_LEAD_WHATSAPP_PHONE,
      name: toTemplateValue(formFields.name),
      phnumber: formatLeadPhoneForTemplate({
        whatsapp: formFields.whatsapp,
        countryCode: formFields.countryCode
      }),
      duration: toTemplateValue(formFields.duration || formFields.dateTime),
      created_at: formatLeadCreatedAt(createdAt),
      goal: toTemplateValue(formFields.goal || formFields.customGoal || formFields.message),
      symptoms: toTemplateValue(formFields.symptoms),
      readiness: toTemplateValue(formFields.readiness),
      service: toTemplateValue(formFields.service),
      ref: toTemplateValue(formFields.ref || formFields.cr_ref)
    })
  );

  const results = await Promise.allSettled(campaignCalls);

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error('Landing page AiSensy campaign failed:', {
        campaign: index === 0 ? 'userConBooked' : 'coachLeadRemainder',
        userId,
        error: result.reason?.response?.data || result.reason?.message || result.reason
      });
    }
  });
};

router.post('/user/form', async (req, res, next) => {
  try {
    const { userId, formEntries, latestForm } = getRequestFormData(req.body);

    console.log(req.body)

    if (!formEntries.length) {
      return res.status(400).json({
        success: false,
        error: 'form data is required'
      });
    }

    const { data: existing, error: fetchError } = await supabase
      .from('user_forms')
      .select('form')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      return res.status(500).json({
        success: false,
        error: fetchError.message
      });
    }

    if (existing) {
      const updatedForms = [...(existing.form || []), ...formEntries];

      const { error: updateError } = await supabase
        .from('user_forms')
        .update({ form: updatedForms })
        .eq('user_id', userId);

      if (updateError) {
        return res.status(500).json({
          success: false,
          error: updateError.message
        });
      }

      await triggerLandingPageMessages({
        userId,
        formFields: latestForm,
        createdAt: new Date().toISOString()
      });

      return res.status(200).json({ success: true, updated: true });
    }

    const { error: insertError } = await supabase
      .from('user_forms')
      .insert([{ user_id: userId, form: formEntries }]);

    if (insertError) {
      return res.status(500).json({
        success: false,
        error: insertError.message
      });
    }

    await triggerLandingPageMessages({
      userId,
      formFields: latestForm,
      createdAt: new Date().toISOString()
    });

    res.status(200).json({ success: true, inserted: true, user_id: userId });
  } catch (err) {
    next(err);
  }
});

router.post('/user/form/open', async (req, res, next) => {

  try {
    const { userId, formEntries, latestForm } = getRequestFormData(req.body);

    console.log("req.body:", req.body);
    
    const { error: insertError } = await supabase
      .from('user_forms')
      .insert([{ user_id: userId, form: formEntries }]);

    if (insertError) {
      return res.status(500).json({
        success: false,
        error: insertError.message
      });
    }

    await triggerLandingPageMessages({
      userId,
      formFields: latestForm,
      createdAt: new Date().toISOString()
    });

    res.status(200).json({ success: true, inserted: true, user_id: userId });
  } catch (err) {
    next(err);
  }
});

export default router;
