require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin@tricher.mjfm7er.mongodb.net/';
const PORT = process.env.PORT || 5000;

// Models
const User = require('./models/User');
const Plan = require('./models/Plan');
const Order = require('./models/Order');

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api', require('./routes/payments'));

async function seedPlans() {
  const plans = [
    { name: 'tricher', price: 3999, durationDays: 0, description: 'Tricher Glasses one-time purchase' },
    { name: 'basic', price: 9.99, durationDays: 30, description: 'Basic monthly plan' },
    { name: 'pro', price: 19.99, durationDays: 30, description: 'Pro monthly plan' }
  ];

  for (const p of plans) {
    await Plan.findOneAndUpdate({ name: p.name }, p, { upsert: true });
  }
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedPlans();
    app.listen(PORT, () => console.log('Server running on port', PORT));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
