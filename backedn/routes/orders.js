const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Plan = require('../models/Plan');

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
      address: address || user.address
    });

    await order.save();
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
