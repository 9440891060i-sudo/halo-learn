const mongoose = require('mongoose');

const CouponUsageSchema = new mongoose.Schema({
  coupon_code: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  // store final amount for quick aggregation (in cents/rupees same units as Order.finalAmount)
  amount: { type: Number },
  used_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CouponUsage', CouponUsageSchema);
