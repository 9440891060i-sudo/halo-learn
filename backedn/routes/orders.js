const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Plan = require('../models/Plan');
const nodemailer = require('nodemailer');

// SMTP Configuration
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'support@tricher.app';

// Mail transporter
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

// Create order
router.post('/', async (req, res) => {
  try {
    const { userId, planId, paymentMethod, address } = req.body;
    const user = await User.findById(userId);
    const plan = await Plan.findById(planId);
    if (!user) return res.status(400).json({ error: 'Invalid user' });
    if (!plan) return res.status(400).json({ error: 'Invalid plan' });

    const order = new Order({
      user: user._id,
      plan: plan._id,
      paymentMethod,
      // allow frontend to override amount (for discounts) or fall back to plan price
      amount: typeof req.body.amount === 'number' ? req.body.amount : plan.price,
      address: address || user.address,
      status: paymentMethod === 'cod' ? 'active' : 'created'
    });

    await order.save();

    // Send confirmation email for COD orders
    if (paymentMethod === 'cod') {
      try {
        if (!user?.email) {
          console.warn('⚠️ No user email, skipping COD confirmation mail');
        } else if (!mailTransporter) {
          console.warn('⚠️ SMTP not configured, skipping COD confirmation mail');
        } else {
          console.log('📤 Sending COD confirmation email to:', user.email);

          const info = await mailTransporter.sendMail({
            from: FROM_EMAIL,
            to: user.email,
            subject: 'Order Confirmed – Cash on Delivery',
            html: `
              <h2>Order Confirmed 📦</h2>
              <p>Hi ${user.name || ''},</p>
              <p>Your order <strong>#${order._id}</strong> has been successfully placed.</p>
              <p><strong>Payment Method:</strong> Cash on Delivery</p>
              <p><strong>Amount:</strong> ₹${order.amount}</p>
              <p><strong>Delivery Address:</strong><br/>${order.address || user.address || 'N/A'}</p>
              <p>Please keep the exact amount ready for payment upon delivery.</p>
              <p>Thank you for choosing Tricher!</p>
              <br/>
              <p>Best regards,<br/>Team Tricher</p>
            `,
          });

          console.log('✅ COD CONFIRMATION EMAIL SENT:', info.messageId);
        }
      } catch (mailErr) {
        console.error('❌ COD EMAIL ERROR:', mailErr);
        // Don't fail the order if email fails
      }
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List orders
router.get('/', async (req, res) => {
  const orders = await Order.find().populate('user').populate('plan').sort({ createdAt: -1 });
  res.json(orders);
});

// Get order by id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('plan');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
