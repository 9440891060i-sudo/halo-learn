const mongoose = require('mongoose');

const CouponUsageSchema = new mongoose.Schema({
  coupon_code: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  used_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CouponUsage', CouponUsageSchema);
