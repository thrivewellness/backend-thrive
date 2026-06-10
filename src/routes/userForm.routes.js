import express from 'express';
import { randomUUID } from 'crypto';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

router.post('/user/form', async (req, res, next) => {
  try {
    const { user_id, ...formFields } = req.body;

    console.log(req.body)

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id is required'
      });
    }

    const { data: existing, error: fetchError } = await supabase
      .from('user_forms')
      .select('form')
      .eq('user_id', user_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      return res.status(500).json({
        success: false,
        error: fetchError.message
      });
    }

    if (existing) {
      const updatedForms = [...(existing.form || []), formFields];

      const { error: updateError } = await supabase
        .from('user_forms')
        .update({ form: updatedForms })
        .eq('user_id', user_id);

      if (updateError) {
        return res.status(500).json({
          success: false,
          error: updateError.message
        });
      }

      return res.status(200).json({ success: true, updated: true });
    }

    const { error: insertError } = await supabase
      .from('user_forms')
      .insert([{ user_id, form: [formFields] }]);

    if (insertError) {
      return res.status(500).json({
        success: false,
        error: insertError.message
      });
    }

    res.status(200).json({ success: true, inserted: true });
  } catch (err) {
    next(err);
  }
});

router.post('/user/form/open', async (req, res, next) => {

  try {
    const { ...formFields } = req.body;

    const user_id = randomUUID();
    
    const { error: insertError } = await supabase
      .from('user_forms')
    .insert([{ user_id, form: [formFields] }]);

    if (insertError) {
      return res.status(500).json({
        success: false,
        error: insertError.message
      });
    }

    res.status(200).json({ success: true, inserted: true, user_id });
  } catch (err) {
    next(err);
  }
});

export default router;
