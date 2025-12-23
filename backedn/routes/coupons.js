const express = require('express');
const router = express.Router();

const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');
const Order = require('../models/Order');

// Create a new coupon (percent by default)
// Body: { code?: string, discount_value: Number, max_uses?: Number, expires_at?: Date }
router.post('/', async (req, res) => {
  try {
    const { code, discount_value, max_uses, expires_at } = req.body;

    if (typeof discount_value !== 'number') {
      return res.status(400).json({ error: 'discount_value (number) is required' });
    }

    let couponCode = code ? String(code).toUpperCase() : `CPN${Date.now().toString().slice(-6)}`;

    // enforce percent-only for partner endpoints
    const coupon = await Coupon.create({
      code: couponCode,
      discount_type: 'percent',
      discount_value: discount_value,
      max_uses: typeof max_uses === 'number' ? max_uses : undefined,
      expires_at: expires_at ? new Date(expires_at) : undefined,
      active: true,
    });

    res.status(201).json(coupon);
  } catch (err) {
    console.error('CREATE COUPON ERROR:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get usage stats for a coupon code
// Returns: { code, uses, totalSales, usages: [...] }
router.get('/:code/usage', async (req, res) => {
  try {
    const code = String(req.params.code).toUpperCase();

    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });

    // aggregate from CouponUsage (we store amount when usage was recorded)
    const agg = await CouponUsage.aggregate([
      { $match: { coupon_code: code } },
      {
        $group: {
          _id: '$coupon_code',
          uses: { $sum: 1 },
          totalSales: { $sum: { $ifNull: ['$amount', 0] } },
        },
      },
    ]);

    const stats = agg[0] || { uses: 0, totalSales: 0 };

    // optionally return recent usage rows
    const usages = await CouponUsage.find({ coupon_code: code }).sort({ used_at: -1 }).limit(50);

    res.json({
      code,
      coupon,
      uses: stats.uses,
      totalSales: stats.totalSales,
      usages,
    });
  } catch (err) {
    console.error('COUPON USAGE ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
