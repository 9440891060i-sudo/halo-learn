const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  // default to percent-based coupons for partner flow
  discount_type: { type: String, enum: ['flat', 'percent'], default: 'percent' },
  discount_value: { type: Number, required: true },
  // sensible default: allow 500 uses unless overridden
  max_uses: { type: Number, default: 500 },
  used_count: { type: Number, default: 0 },
  expires_at: { type: Date },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coupon', CouponSchema);
