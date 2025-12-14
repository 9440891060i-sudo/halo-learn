const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  durationDays: { type: Number, default: 30 },
  description: { type: String }
});

module.exports = mongoose.model('Plan', PlanSchema);
