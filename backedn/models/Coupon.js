const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount_type: { type: String, enum: ['flat', 'percent'], default: 'flat' },
  discount_value: { type: Number, required: true },
  max_uses: { type: Number, default: 0 },
  used_count: { type: Number, default: 0 },
  expires_at: { type: Date },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coupon', CouponSchema);
