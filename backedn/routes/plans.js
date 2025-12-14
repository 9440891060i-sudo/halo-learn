const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

// List plans
router.get('/', async (req, res) => {
  const plans = await Plan.find();
  res.json(plans);
});

// Get plan by id
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
