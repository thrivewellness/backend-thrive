import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

router.get("/payment/verify/:uuid", async (req, res) => {

  
  const { uuid } = req.params;

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("id", uuid)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }
  
  res.json(data);
});


export default router;