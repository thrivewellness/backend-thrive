import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

router.post('/contact', async (req, res, next) => {
  try {
    const body = req.body;

    const { error } = await supabase
      .from('contact_messages')
      .insert([body]);

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to save message'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!'
    });
  } catch (err) {
    next(err);
  }
});


export default router;
