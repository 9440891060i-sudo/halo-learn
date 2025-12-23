const express = require('express');
const router = express.Router();

const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Order = require('../models/Order');

const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

/* =========================
   ENV VARIABLES
========================= */
const SMTP_HOST = process.env.SMTP_HOST; // email-smtp.ap-south-1.amazonaws.com
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'support@tricher.app';

const RZP_KEY = process.env.RZP_KEY;
const RZP_SECRET = process.env.RZP_SECRET;

/* =========================
   STARTUP LOG (IMPORTANT)
========================= */
console.log('📧 SMTP CONFIG CHECK:', {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER_SET: !!SMTP_USER,
  SMTP_PASS_SET: !!SMTP_PASS,
  FROM_EMAIL,
});

/* =========================
   RAZORPAY INIT
========================= */
const razorpay = new Razorpay({
  key_id: RZP_KEY,
  key_secret: RZP_SECRET,
});

/* =========================
   MAIL TRANSPORTER (REUSABLE)
========================= */
const mailTransporter =
  SMTP_HOST && SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      })
    : null;

/* =========================
   PRICE + COUPON CALC
========================= */
async function calculateFinalAmount(originalPrice, couponCode) {
  if (!couponCode) {
    return { original: originalPrice, discount: 0, final: originalPrice };
  }

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    active: true,
  });

  if (!coupon) return { valid: false };

  if (coupon.expires_at && coupon.expires_at < new Date()) return { valid: false };
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) return { valid: false };

  let discount = 0;
  // Normalize and validate discount type/value
  const discType = (coupon.discount_type || '').toString().toLowerCase();
  if (discType === 'flat') {
    discount = Number(coupon.discount_value) || 0;
  } else if (discType === 'percent' || discType === 'percentage') {
    let pct = Number(coupon.discount_value) || 0;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    discount = Math.floor((originalPrice * pct) / 100);
  } else {
    // Fallback: treat unknown type as flat amount
    discount = Number(coupon.discount_value) || 0;
  }

  const final = Math.max(0, originalPrice - discount);
  return { original: originalPrice, discount, final, valid: true };
}

/* =========================
   APPLY COUPON
========================= */
router.post('/apply-coupon', async (req, res) => {
  try {
    const { coupon, originalPrice } = req.body;
    const result = await calculateFinalAmount(originalPrice, coupon);

    if (!result.valid) {
      return res.status(400).json({ error: 'Invalid or expired coupon' });
    }

    res.json(result);
  } catch (err) {
    console.error('❌ APPLY COUPON ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE ORDER
========================= */
router.post('/create-order', async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      address,
      city,
      pincode,
      coupon,
      productId,
      originalPrice,
      paymentMethod,
    } = req.body;

    const calc = await calculateFinalAmount(originalPrice, coupon);
    if (coupon && !calc.valid) {
      return res.status(400).json({ error: 'Invalid coupon' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      // create user only with provided fields (name may be empty for digital-only purchases)
      const userData = { email };
      if (name) userData.name = name;
      if (mobile) userData.mobile = mobile;
      if (address) userData.address = address;
      if (city) userData.city = city;
      if (pincode) userData.pincode = pincode;
      user = await User.create(userData);
    } else {
      // update only fields that are provided (do not overwrite with empty strings)
      if (name) user.name = name;
      if (mobile) user.mobile = mobile;
      if (address) user.address = address;
      if (city) user.city = city;
      if (pincode) user.pincode = pincode;
      await user.save();
    }

    let plan = await Plan.findOne({ name: productId || 'tricher' });

    const rzpOrder = await razorpay.orders.create({
      amount: calc.final * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    const order = await Order.create({
      user: user._id,
      plan: plan?._id,
      paymentMethod: paymentMethod || 'online',
      amount: originalPrice,
      finalAmount: calc.final,
      address,
      status: 'created',
      razorpayOrderId: rzpOrder.id,
      couponCode: coupon?.toUpperCase(),
    });

    res.json({
      razorpayOrder: rzpOrder,
      orderId: order._id,
      key: RZP_KEY,
      finalAmount: calc.final,
    });
  } catch (err) {
    console.error('❌ CREATE ORDER ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});
/* =========================
   GET LOGGED-IN USER + PLAN
   GET /api/me?email=
========================= */
router.get('/me', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // get latest ACTIVE order
    const order = await Order.findOne({
      user: user._id,
      status: 'active',
    })
      .populate('plan')
      .sort({ createdAt: -1 });

    let plan = null;

    if (order && order.plan) {
      let expiresAt = null;

      if (order.plan.durationDays > 0) {
        expiresAt = new Date(order.createdAt);
        expiresAt.setDate(
          expiresAt.getDate() + order.plan.durationDays
        );
      }

      plan = {
        name: order.plan.name,
        description: order.plan.description,
        price: order.plan.price,
        expiresAt, // null = lifetime
      };
    }

    res.json({
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
      plan,
    });
  } catch (err) {
    console.error('❌ /me ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   VERIFY PAYMENT + EMAIL
========================= */
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const hmac = crypto.createHmac('sha256', RZP_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const order = await Order.findOne({
      _id: orderId,
      razorpayOrderId: razorpay_order_id,
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = 'active';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    console.log('📦 ORDER VERIFIED:', order._id);

    if (order.couponCode) {
      await CouponUsage.create({ coupon_code: order.couponCode, user_id: order.user });
      await Coupon.findOneAndUpdate(
        { code: order.couponCode },
        { $inc: { used_count: 1 } }
      );
    }

    try {
      const user = await User.findById(order.user);

      if (!user?.email) {
        console.warn('⚠️ No user email, skipping mail');
      } else if (!mailTransporter) {
        console.warn('⚠️ SMTP not ready, skipping mail');
      } else {
        console.log('📤 Sending onboarding email to:', user.email);

        const info = await mailTransporter.sendMail({
          from: FROM_EMAIL,
          to: user.email,
          subject: 'Welcome to Tricher – Order Confirmed',
          html: `
            <h2>Welcome to Tricher 👋</h2>
            <p>Hi ${user.name || ''},</p>
            <p>Your order <strong>${order._id}</strong> has been successfully confirmed.</p>
            <p>Thank you for choosing Tricher.</p>
          `,
        });

        console.log('✅ EMAIL SENT:', info.messageId);
      }
    } catch (mailErr) {
      console.error('❌ EMAIL ERROR:', mailErr);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('❌ VERIFY PAYMENT ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   TEST EMAIL ENDPOINT
========================= */
router.get('/test-email', async (req, res) => {
  try {
    if (!mailTransporter) {
      return res.status(500).json({ error: 'SMTP not configured' });
    }

    const info = await mailTransporter.sendMail({
      from: FROM_EMAIL,
      to: 'psaisuryacharan@gmail.com', // CHANGE THIS
      subject: '✅ Tricher SES Test',
      text: 'If you received this, AWS SES + Nodemailer is working.',
    });

    console.log('✅ TEST EMAIL SENT:', info.messageId);

    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('❌ TEST EMAIL FAILED:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

/* =========================
   OTP SERVICE
   - POST /send-otp { email }
   - POST /verify-otp { email, otp }
   Note: simple in-memory store with expiry for demo purposes.
========================= */

const otpStore = new Map(); // email -> { code, expiresAt }

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const code = generateOtp();

    // Store with 5 minute expiry
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { code, expiresAt });

    // schedule removal
    setTimeout(() => {
      const entry = otpStore.get(email);
      if (entry && entry.expiresAt <= Date.now()) otpStore.delete(email);
    }, 5 * 60 * 1000 + 1000);

    // send mail if transporter available
    if (!mailTransporter) {
      console.warn('SMTP not configured, OTP will not be emailed. OTP:', code);
    } else {
      try {
        await mailTransporter.sendMail({
          from: FROM_EMAIL,
          to: email,
          subject: 'Your Tricher OTP',
          text: `Your OTP is ${code}. It will expire in 5 minutes.`,
        });
      } catch (mailErr) {
        console.error('OTP EMAIL ERROR:', mailErr);
      }
    }

    // Determine user status
    const user = await User.findOne({ email });
    let userType = 'new';
    if (user) {
      // find latest order for user
      const latestOrder = await Order.findOne({ user: user._id }).sort({ createdAt: -1 });
      if (latestOrder) {
        if (latestOrder.status === 'active') userType = 'active';
        else userType = 'expired';
      } else {
        userType = 'new';
      }
    }

    res.json({ ok: true, userType });
  } catch (err) {
    console.error('SEND OTP ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

    const entry = otpStore.get(email);
    if (!entry) return res.status(400).json({ error: 'OTP expired or not sent' });
    if (entry.code !== otp) return res.status(400).json({ error: 'Invalid OTP' });

    // OTP valid; remove it
    otpStore.delete(email);

    // Determine user status as above
    const user = await User.findOne({ email });
    let userType = 'new';
    if (user) {
      const latestOrder = await Order.findOne({ user: user._id }).sort({ createdAt: -1 });
      if (latestOrder) {
        if (latestOrder.status === 'active') userType = 'active';
        else userType = 'expired';
      } else {
        userType = 'new';
      }
    }

    res.json({ ok: true, userType });
  } catch (err) {
    console.error('VERIFY OTP ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});
