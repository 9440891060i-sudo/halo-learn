const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  paymentMethod: { type: String, required: true },
  amount: { type: Number, required: true },
  address: { type: String },
  status: { type: String, default: 'pending' },
  // razorpay fields
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  couponCode: { type: String },
  finalAmount: { type: Number },
  // delhivery fields
  delhiveryWaybill: { type: String }, // Tracking number
  delhiveryOrderId: { type: String }, // Delhivery order ID
  delhiveryTrackingUrl: { type: String }, // Full tracking URL
  // shiprocket fields
  shiprocketOrderId: { type: String },
  shiprocketShipmentId: { type: String },
  shiprocketAwb: { type: String }, // AWB tracking number
  shiprocketTrackingUrl: { type: String }, // Full tracking URL
  shipmentStatus: { type: String, default: 'pending' }, // pending, shipped, delivered, etc.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
