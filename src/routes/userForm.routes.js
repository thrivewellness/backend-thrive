import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

router.post('/user/form', async (req, res, next) => {
  try {
    const { user_id, ...formFields } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id is required'
      });
    }

    const { data: existing, error: fetchError } = await supabase
      .from('user')
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
        .from('user')
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
      .from('user')
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


export default router;
