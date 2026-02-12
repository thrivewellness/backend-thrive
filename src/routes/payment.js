import express from "express";
import crypto from "crypto";
import { razorpay } from "../lib/razorpay.js";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

/**
 * CREATE ORDER
 */
router.post("/create-order", async (req, res) => {
  const { amount, user, program, duration } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    res.json({
      ...order,
      meta: { user, program, duration, amount },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * VERIFY PAYMENT + SAVE TO SUPABASE
 */
router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    meta, // passed from frontend
  } = req.body;

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.json({ success: false });
    }

    /**
     * INSERT INTO SUPABASE
     */
      const { data, error } = await supabase
          .from("payments")
          .insert({
              full_name: meta.user.fullName,
              email: meta.user.email,
              phone: meta.user.phone,
              condition: meta.user.condition,
              program: meta.program,
              duration: meta.duration,
              ref_id: meta.user.ref_id || null,
              part_id: meta.user.part_id || null,
              amount: meta.amount,
              razorpay_order_id,
              razorpay_payment_id,
              status: "SUCCESS",
          })
          .select("id")
          .single();

      if (error) {
          console.error("Supabase insert error:", error);
          return res.status(500).json({ success: false });
      }

      res.json({
          success: true,
          payment_id: data.id,
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
